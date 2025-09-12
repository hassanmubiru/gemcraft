import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletConnection, CeloNetwork, ContractAddresses } from '../types/blockchain';

interface WalletContextType {
  connection: WalletConnection | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: CeloNetwork) => Promise<void>;
  getBalance: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, value: string, data?: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Celo Alfajores testnet configuration
const ALFAJORES_NETWORK: CeloNetwork = {
  name: 'Celo Alfajores',
  chainId: 44787,
  rpcUrl: 'https://alfajores-forno.celo-testnet.org',
  explorerUrl: 'https://explorer.celo.org/alfajores',
  nativeCurrency: {
    name: 'Celo',
    symbol: 'CELO',
    decimals: 18,
  },
};

const CONTRACT_ADDRESSES: ContractAddresses = {
  rewards: process.env.REWARDS_CONTRACT_ADDRESS || '',
  nftGem: process.env.NFT_GEM_CONTRACT_ADDRESS || '',
  leaderboard: process.env.LEADERBOARD_CONTRACT_ADDRESS || '',
  testCUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // Alfajores test cUSD
  testCELO: '0xF194afDf50B03a69Ea33B7c6CF6a2A4E7B3F8C2D', // Alfajores test CELO
};

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      // Check if MetaMask or other wallet is connected
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
          if (parseInt(chainId, 16) === ALFAJORES_NETWORK.chainId) {
            await connectToExistingWallet(accounts[0]);
          }
        }
      }
    } catch (err) {
      console.log('No existing wallet connection');
    }
  };

  const connectToExistingWallet = async (address: string) => {
    try {
      const balance = await getWalletBalance(address);
      setConnection({
        address,
        chainId: ALFAJORES_NETWORK.chainId,
        isConnected: true,
        balance,
      });
    } catch (err) {
      console.error('Error connecting to existing wallet:', err);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('No wallet found. Please install MetaMask or Celo Wallet.');
      }

      const ethereum = (window as any).ethereum;

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      if (!address) {
        throw new Error('No account selected');
      }

      // Check if we're on the correct network
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16) !== ALFAJORES_NETWORK.chainId) {
        await switchToAlfajores();
      }

      // Get balance
      const balance = await getWalletBalance(address);

      setConnection({
        address,
        chainId: ALFAJORES_NETWORK.chainId,
        isConnected: true,
        balance,
      });

    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToAlfajores = async () => {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ALFAJORES_NETWORK.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${ALFAJORES_NETWORK.chainId.toString(16)}`,
              chainName: ALFAJORES_NETWORK.name,
              rpcUrls: [ALFAJORES_NETWORK.rpcUrl],
              nativeCurrency: ALFAJORES_NETWORK.nativeCurrency,
              blockExplorerUrls: [ALFAJORES_NETWORK.explorerUrl],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  };

  const getWalletBalance = async (address: string) => {
    try {
      // Get CELO balance
      const celoBalance = await (window as any).ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      // Get cUSD balance (you would need to call the contract for this)
      // For now, we'll use a placeholder
      const cusdBalance = '0';

      return {
        CELO: (parseInt(celoBalance, 16) / Math.pow(10, 18)).toFixed(4),
        cUSD: cusdBalance,
        cEUR: '0',
      };
    } catch (err) {
      console.error('Error getting balance:', err);
      return {
        CELO: '0',
        cUSD: '0',
        cEUR: '0',
      };
    }
  };

  const disconnectWallet = () => {
    setConnection(null);
    setError(null);
  };

  const switchNetwork = async (network: CeloNetwork) => {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
    } catch (err: any) {
      throw new Error(`Failed to switch to ${network.name}: ${err.message}`);
    }
  };

  const getBalance = async () => {
    if (!connection) return;

    try {
      const balance = await getWalletBalance(connection.address);
      setConnection(prev => prev ? { ...prev, balance } : null);
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!connection) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, connection.address],
      });
      return signature;
    } catch (err: any) {
      throw new Error(`Failed to sign message: ${err.message}`);
    }
  };

  const sendTransaction = async (to: string, value: string, data?: string): Promise<string> => {
    if (!connection) {
      throw new Error('Wallet not connected');
    }

    try {
      const transaction = {
        from: connection.address,
        to,
        value: `0x${parseInt(value).toString(16)}`,
        data: data || '0x',
      };

      const txHash = await (window as any).ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });

      return txHash;
    } catch (err: any) {
      throw new Error(`Transaction failed: ${err.message}`);
    }
  };

  const value: WalletContextType = {
    connection,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getBalance,
    signMessage,
    sendTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
