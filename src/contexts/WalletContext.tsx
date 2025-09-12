import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { walletManager, WalletState } from '../utils/CeloWallet';

interface WalletContextType {
  walletState: WalletState;
  connectWallet: () => Promise<boolean>;
  connectBrowserWallet: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  updateBalance: () => Promise<void>;
  sendCUSD: (to: string, amount: string) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>(walletManager.getState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to wallet state changes
    const unsubscribe = walletManager.subscribe((newState) => {
      setWalletState(newState);
    });

    // Initial state
    setWalletState(walletManager.getState());

    return unsubscribe;
  }, []);

  const connectWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await walletManager.connectWalletConnect();
      if (!success) {
        setError('Failed to connect wallet');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const connectBrowserWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await walletManager.connectBrowserWallet();
      if (!success) {
        setError('Failed to connect browser wallet');
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await walletManager.disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async (): Promise<void> => {
    try {
      await walletManager.updateBalance();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update balance');
    }
  };

  const sendCUSD = async (to: string, amount: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const txHash = await walletManager.sendCUSD(to, amount);
      await updateBalance(); // Update balance after transaction
      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send cUSD');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: WalletContextType = {
    walletState,
    connectWallet,
    connectBrowserWallet,
    disconnect,
    updateBalance,
    sendCUSD,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
