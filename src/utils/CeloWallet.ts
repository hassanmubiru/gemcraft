import { ContractKit, newKit } from '@celo/contractkit';
import { WalletConnectWallet } from '@celo/wallet-walletconnect';
import { LedgerWallet } from '@celo/wallet-ledger';
import { ethers } from 'ethers';

// Celo network configurations
export const CELO_NETWORKS = {
  alfajores: {
    name: 'Alfajores Testnet',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    chainId: 44787,
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    blockExplorerUrl: 'https://alfajores-blockscout.celo-testnet.org',
  },
  mainnet: {
    name: 'Celo Mainnet',
    rpcUrl: 'https://forno.celo.org',
    chainId: 42220,
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    blockExplorerUrl: 'https://explorer.celo.org',
  },
};

// Token addresses on Celo
export const TOKEN_ADDRESSES = {
  alfajores: {
    CELO: '0xF194afDf50B03a69D033Bf11be2A8A324',
    cUSD: '0x874069Fa1Eb16D44d62F6aDD3B9835bdf8af4b4',
    cEUR: '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
  },
  mainnet: {
    CELO: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    cEUR: '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  },
};

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: {
    CELO: string;
    cUSD: string;
    cEUR: string;
  };
  network: 'alfajores' | 'mainnet' | null;
  kit: ContractKit | null;
}

export class CeloWalletManager {
  private kit: ContractKit | null = null;
  private wallet: any = null;
  private state: WalletState = {
    isConnected: false,
    address: null,
    balance: {
      CELO: '0',
      cUSD: '0',
      cEUR: '0',
    },
    network: null,
    kit: null,
  };

  private listeners: ((state: WalletState) => void)[] = [];

  constructor() {
    this.initializeKit();
  }

  private async initializeKit() {
    try {
      // Initialize with Alfajores testnet by default
      this.kit = newKit(CELO_NETWORKS.alfajores.rpcUrl);
      this.state.kit = this.kit;
      this.state.network = 'alfajores';
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to initialize Celo kit:', error);
    }
  }

  // Connect wallet using WalletConnect
  async connectWalletConnect(): Promise<boolean> {
    try {
      if (!this.kit) {
        await this.initializeKit();
      }

      this.wallet = new WalletConnectWallet({
        connect: {
          metadata: {
            name: 'GemCraft',
            description: 'Match-3 Game on Celo',
            url: 'https://gemcraft.celo.org',
            icons: ['https://gemcraft.celo.org/icon.png'],
          },
        },
      });

      await this.wallet.init();
      this.kit!.addAccount(this.wallet);
      this.kit!.defaultAccount = this.wallet.getAccounts()[0];

      this.state.isConnected = true;
      this.state.address = this.wallet.getAccounts()[0];
      this.state.network = 'alfajores';

      await this.updateBalance();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  // Connect using browser wallet (MetaMask, etc.)
  async connectBrowserWallet(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('No browser wallet found');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const targetChainId = `0x${CELO_NETWORKS.alfajores.chainId.toString(16)}`;

      if (chainId !== targetChainId) {
        // Request to switch network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
      }

      this.state.isConnected = true;
      this.state.address = accounts[0];
      this.state.network = 'alfajores';

      await this.updateBalance();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to connect browser wallet:', error);
      return false;
    }
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    try {
      if (this.wallet) {
        await this.wallet.close();
      }
      
      this.wallet = null;
      this.kit = null;
      this.state = {
        isConnected: false,
        address: null,
        balance: {
          CELO: '0',
          cUSD: '0',
          cEUR: '0',
        },
        network: null,
        kit: null,
      };

      this.notifyListeners();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }

  // Update wallet balance
  async updateBalance(): Promise<void> {
    if (!this.kit || !this.state.address) return;

    try {
      const network = this.state.network || 'alfajores';
      const tokenAddresses = TOKEN_ADDRESSES[network];

      // Get CELO balance
      const celoBalance = await this.kit.getTotalBalance(this.state.address);
      this.state.balance.CELO = ethers.utils.formatEther(celoBalance.CELO.toString());

      // Get cUSD balance
      const cUSDContract = await this.kit.contracts.getStableToken(tokenAddresses.cUSD);
      const cUSDBalance = await cUSDContract.balanceOf(this.state.address);
      this.state.balance.cUSD = ethers.utils.formatEther(cUSDBalance.toString());

      // Get cEUR balance
      const cEURContract = await this.kit.contracts.getStableToken(tokenAddresses.cEUR);
      const cEURBalance = await cEURContract.balanceOf(this.state.address);
      this.state.balance.cEUR = ethers.utils.formatEther(cEURBalance.toString());

      this.notifyListeners();
    } catch (error) {
      console.error('Failed to update balance:', error);
    }
  }

  // Send cUSD tokens
  async sendCUSD(to: string, amount: string): Promise<string> {
    if (!this.kit || !this.state.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const network = this.state.network || 'alfajores';
      const tokenAddresses = TOKEN_ADDRESSES[network];
      
      const stableToken = await this.kit.contracts.getStableToken(tokenAddresses.cUSD);
      const tx = await stableToken.transfer(to, ethers.utils.parseEther(amount)).send();
      const receipt = await tx.waitReceipt();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Failed to send cUSD:', error);
      throw error;
    }
  }

  // Get current wallet state
  getState(): WalletState {
    return { ...this.state };
  }

  // Subscribe to wallet state changes
  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Global wallet manager instance
export const walletManager = new CeloWalletManager();

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
