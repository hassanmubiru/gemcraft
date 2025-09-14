import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWallet } from '../contexts/WalletContext';
import { blockchainManager, BlockchainMode } from '../utils/BlockchainManager';

const BlockchainSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { walletState } = useWallet();
  const [currentMode, setCurrentMode] = useState<BlockchainMode>('mock');
  const [isRealAvailable, setIsRealAvailable] = useState(false);

  useEffect(() => {
    setCurrentMode(blockchainManager.getMode());
    setIsRealAvailable(blockchainManager.isRealBlockchainAvailable());
  }, []);

  const handleModeChange = (mode: BlockchainMode) => {
    if (mode === 'real' && !isRealAvailable) {
      Alert.alert(
        'Real Blockchain Not Available',
        'The smart contracts are not yet deployed to Celo Alfajores testnet. Please use Test Mode for now.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (mode === 'real' && !walletState.isConnected) {
      Alert.alert(
        'Wallet Not Connected',
        'Please connect your wallet to use Real Blockchain mode.',
        [
          { text: 'Cancel' },
          { text: 'Connect Wallet', onPress: () => navigation.navigate('Wallet' as never) }
        ]
      );
      return;
    }

    try {
      blockchainManager.setMode(mode, walletState.kit);
      setCurrentMode(mode);
      
      Alert.alert(
        'Mode Changed',
        `Switched to ${blockchainManager.getModeDisplayName()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to change mode:', error);
      Alert.alert('Error', 'Failed to change blockchain mode. Please try again.');
    }
  };

  const renderModeCard = (mode: BlockchainMode, title: string, description: string, icon: string) => {
    const isSelected = currentMode === mode;
    const isDisabled = mode === 'real' && !isRealAvailable;

    return (
      <TouchableOpacity
        style={[
          styles.modeCard,
          isSelected && styles.selectedCard,
          isDisabled && styles.disabledCard
        ]}
        onPress={() => !isDisabled && handleModeChange(mode)}
        disabled={isDisabled}
      >
        <View style={styles.modeHeader}>
          <Text style={styles.modeIcon}>{icon}</Text>
          <View style={styles.modeInfo}>
            <Text style={[styles.modeTitle, isDisabled && styles.disabledText]}>
              {title}
            </Text>
            <Text style={[styles.modeDescription, isDisabled && styles.disabledText]}>
              {description}
            </Text>
          </View>
          <Switch
            value={isSelected}
            onValueChange={() => !isDisabled && handleModeChange(mode)}
            disabled={isDisabled}
            trackColor={{ false: '#767577', true: '#2ECC71' }}
            thumbColor={isSelected ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
        
        {mode === 'real' && !isRealAvailable && (
          <View style={styles.unavailableBanner}>
            <Text style={styles.unavailableText}>
              ⚠️ Smart contracts not deployed yet
            </Text>
          </View>
        )}
        
        {isSelected && (
          <View style={styles.selectedBanner}>
            <Text style={styles.selectedText}>
              ✅ Currently Active
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Blockchain Settings</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Blockchain Mode</Text>
        <Text style={styles.sectionDescription}>
          Select how you want to interact with the blockchain for rewards and NFTs.
        </Text>

        {renderModeCard(
          'mock',
          'Test Mode',
          'Simulated blockchain for testing. No real transactions or rewards.',
          '🧪'
        )}

        {renderModeCard(
          'real',
          'Live Mode',
          'Real Celo blockchain. Real cUSD rewards and NFT minting.',
          '🚀'
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Current Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Mode:</Text>
            <Text style={styles.statusValue}>{blockchainManager.getModeDisplayName()}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Description:</Text>
            <Text style={styles.statusValue}>{blockchainManager.getModeDescription()}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Real Rewards:</Text>
            <Text style={[styles.statusValue, blockchainManager.areRewardsReal() ? styles.successText : styles.warningText]}>
              {blockchainManager.areRewardsReal() ? 'Yes' : 'No (Test Mode)'}
            </Text>
          </View>
        </View>

        <View style={styles.walletCard}>
          <Text style={styles.walletTitle}>Wallet Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Connected:</Text>
            <Text style={[styles.statusValue, walletState.isConnected ? styles.successText : styles.errorText]}>
              {walletState.isConnected ? 'Yes' : 'No'}
            </Text>
          </View>
          {walletState.isConnected && (
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Address:</Text>
              <Text style={styles.statusValue}>
                {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#2ECC71',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 30,
    lineHeight: 20,
  },
  modeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2ECC71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  disabledCard: {
    opacity: 0.5,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  modeDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 18,
  },
  disabledText: {
    color: '#666',
  },
  unavailableBanner: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  unavailableText: {
    color: '#E74C3C',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedBanner: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  selectedText: {
    color: '#2ECC71',
    fontSize: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    color: '#A0A0A0',
    width: 100,
  },
  statusValue: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  successText: {
    color: '#2ECC71',
  },
  warningText: {
    color: '#F39C12',
  },
  errorText: {
    color: '#E74C3C',
  },
  walletCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
});

export default BlockchainSettingsScreen;
