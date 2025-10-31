import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNotificationBell?: boolean;
  showLanguageSwitcher?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showNotificationBell = true,
  showLanguageSwitcher = true,
  leftComponent,
  rightComponent
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const headerStyle = { paddingTop: insets.top + 12 };

  const defaultTitle = t('defaultTitle');
  const defaultSubtitle = t('defaultSubtitle');

  return (
    <View style={[styles.header, headerStyle]}>
      <View style={styles.leftComponent}>
        {leftComponent !== undefined ? leftComponent : (
          <Image
            source={require('../assets/coffee_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title || defaultTitle}</Text>
        {subtitle !== null && (
          <Text style={styles.subtitle}>{subtitle !== undefined ? subtitle : defaultSubtitle}</Text>
        )}
      </View>
      <View style={styles.rightComponent}>
        {rightComponent !== undefined ? rightComponent : (
          <View style={styles.rightControls}>
            {showNotificationBell && <NotificationBell />}
            {showLanguageSwitcher && <LanguageSwitcher />}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFF8E7',
    borderBottomWidth: 1,
    borderBottomColor: '#D4A574',
  },
  leftComponent: {
    width: 40,
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6F4E37',
    marginTop: 2,
    textAlign: 'center',
  },
  rightComponent: {
    minWidth: 40,
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default Header;
