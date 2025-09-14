// Enhanced WalletConnect Component for GemCraft
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useWallet } from '../contexts/WalletContext';
import { CELO_NETWORKS } from '../utils/CeloWallet';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WalletConnectProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  showBalance?: boolean;
  compact?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  showBalance = true,
  compact = false,
}) => {
  const {
    walletState,
    connectWallet,
    connectBrowserWallet,
    disconnect,
    updateBalance,
    isLoading,
    error,
  } = useWallet();

  const [showModal, setShowModal] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<'walletconnect' | 'browser' | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Wallet Error', error);
    }
  }, [error]);

  useEffect(() => {
    if (walletState.isConnected && onConnect) {
      onConnect();
    }
  }, [walletState.isConnected, onConnect]);

  const handleConnect = async (method: 'walletconnect' | 'browser') => {
    setConnectionMethod(method);
    setShowModal(false);
    
    let success = false;
    if (method === 'walletconnect') {
      success = await connectWallet();
    } else {
      success = await connectBrowserWallet();
    }
    
    if (success) {
      await updateBalance();
      Alert.alert(
        'Wallet Connected!',
        `Connected to ${walletState.address?.slice(0, 6)}...${walletState.address?.slice(-4)}`,
        [{ text: 'Great!' }]
      );
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnect();
            if (onDisconnect) {
              onDisconnect();
            }
          },
        },
      ]
    );
  };

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.001) return '< 0.001';
    return num.toFixed(3);
  };

  const getNetworkName = (): string => {
    if (!walletState.network) return 'Not Connected';
    return CELO_NETWORKS[walletState.network].name;
  };

  const getNetworkColor = (): string => {
    if (!walletState.network) return '#7F8C8D';
    return walletState.network === 'alfajores' ? '#F39C12' : '#2ECC71';
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {walletState.isConnected ? (
          <TouchableOpacity style={styles.compactConnected} onPress={handleDisconnect}>
            <View style={[styles.statusDot, { backgroundColor: '#2ECC71' }]} />
            <Text style={styles.compactText}>{formatAddress(walletState.address || '')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.compactDisconnected} 
            onPress={() => setShowModal(true)}
            disabled={isLoading}
          >
            <Text style={styles.compactText}>
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {walletState.isConnected ? (
        <View style={styles.connectedContainer}>
          {/* Connection Status */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#2ECC71' }]} />
            <Text style={styles.statusText}>Connected</Text>
            <View style={[styles.networkBadge, { backgroundColor: getNetworkColor() }]}>
              <Text style={styles.networkText}>{walletState.network?.toUpperCase()}</Text>
            </View>
          </View>

          {/* Wallet Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Address:</Text>
            <Text style={styles.addressText}>{formatAddress(walletState.address || '')}</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyButtonText}>📋</Text>
            </TouchableOpacity>
          </View>

          {/* Network Info */}
          <View style={styles.networkContainer}>
            <Text style={styles.networkLabel}>Network:</Text>
            <Text style={styles.networkName}>{getNetworkName()}</Text>
          </View>

          {/* Balance Display */}
          {showBalance && (
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceTitle}>Balances</Text>
              <View style={styles.balanceGrid}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>CELO</Text>
                  <Text style={styles.balanceValue}>{formatBalance(walletState.balance.CELO)}</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>cUSD</Text>
                  <Text style={styles.balanceValue}>{formatBalance(walletState.balance.cUSD)}</Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>cEUR</Text>
                  <Text style={styles.balanceValue}>{formatBalance(walletState.balance.cEUR)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.refreshButton} onPress={updateBalance}>
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.disconnectedContainer}>
          <View style={styles.disconnectedHeader}>
            <Text style={styles.disconnectedTitle}>Connect Your Wallet</Text>
            <Text style={styles.disconnectedSubtitle}>
              Connect to start earning rewards and playing with real cUSD!
            </Text>
          </View>

          <View style={styles.connectionMethods}>
            <TouchableOpacity
              style={styles.connectionButton}
              onPress={() => handleConnect('walletconnect')}
              disabled={isLoading}
            >
              <Text style={styles.connectionIcon}>📱</Text>
              <Text style={styles.connectionTitle}>WalletConnect</Text>
              <Text style={styles.connectionDescription}>
                Connect with mobile wallets like Valora, MetaMask Mobile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.connectionButton}
              onPress={() => handleConnect('browser')}
              disabled={isLoading}
            >
              <Text style={styles.connectionIcon}>🌐</Text>
              <Text style={styles.connectionTitle}>Browser Wallet</Text>
              <Text style={styles.connectionDescription}>
                Connect with MetaMask, Coinbase Wallet, or other browser extensions
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Connecting to wallet...</Text>
            </View>
          )}
        </View>
      )}

      {/* Connection Method Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Connection Method</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleConnect('walletconnect')}
            >
              <Text style={styles.modalButtonIcon}>📱</Text>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonTitle}>WalletConnect</Text>
                <Text style={styles.modalButtonDescription}>
                  Mobile wallets (Valora, MetaMask Mobile)
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleConnect('browser')}
            >
              <Text style={styles.modalButtonIcon}>🌐</Text>
              <View style={styles.modalButtonContent}>
                <Text style={styles.modalButtonTitle}>Browser Wallet</Text>
                <Text style={styles.modalButtonDescription}>
                  Browser extensions (MetaMask, Coinbase)
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactConnected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  compactDisconnected: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498DB',
  },
  compactText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  connectedContainer: {
    // Connected state styles
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  networkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  networkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginRight: 8,
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    flex: 1,
  },
  copyButton: {
    padding: 4,
  },
  copyButtonText: {
    fontSize: 16,
  },
  networkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginRight: 8,
  },
  networkName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceContainer: {
    marginBottom: 16,
  },
  balanceTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refreshButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498DB',
    flex: 1,
    marginRight: 8,
  },
  refreshButtonText: {
    color: '#3498DB',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  disconnectButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E74C3C',
    flex: 1,
    marginLeft: 8,
  },
  disconnectButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  disconnectedContainer: {
    // Disconnected state styles
  },
  disconnectedHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  disconnectedTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  disconnectedSubtitle: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  connectionMethods: {
    gap: 12,
  },
  connectionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  connectionIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  connectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  connectionDescription: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    color: '#3498DB',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 16,
    padding: 24,
    width: screenWidth * 0.9,
    maxWidth: 400,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  modalButtonContent: {
    flex: 1,
  },
  modalButtonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalButtonDescription: {
    color: '#A0A0A0',
    fontSize: 12,
    lineHeight: 16,
  },
  modalCancelButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E74C3C',
    marginTop: 8,
  },
  modalCancelText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default WalletConnect;
