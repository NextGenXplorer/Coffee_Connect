import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, updateDoc, doc, Timestamp, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase.config';
import { AdminUser, CoffeePrice, PriceFormData } from '../types';
import { adminAuth } from '../utils/adminAuth';
import Header from '../components/Header';

interface AdminPriceFormScreenProps {
  user: AdminUser;
  priceToEdit?: CoffeePrice | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminPriceFormScreen({
  user,
  priceToEdit,
  onSave,
  onCancel,
}: AdminPriceFormScreenProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PriceFormData>({
    breed: 'Arabica Parchment',
    market: user.market === 'all' ? 'Madikeri' : user.market,
    minPrice: 0,
    maxPrice: 0,
    quality: 'A',
  });

  const availableMarkets = adminAuth.getAvailableMarkets(user);

  useEffect(() => {
    if (priceToEdit) {
      setFormData({
        breed: priceToEdit.breed,
        market: priceToEdit.market,
        minPrice: priceToEdit.minPrice,
        maxPrice: priceToEdit.maxPrice,
        quality: priceToEdit.quality,
      });
    }
  }, [priceToEdit]);

  const updateField = (field: keyof PriceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.market.trim()) {
      newErrors.market = 'Market is required';
    }

    if (formData.minPrice <= 0) {
      newErrors.minPrice = 'Minimum price must be greater than 0';
    }

    if (formData.maxPrice <= 0) {
      newErrors.maxPrice = 'Maximum price must be greater than 0';
    }

    if (formData.minPrice >= formData.maxPrice) {
      newErrors.maxPrice = 'Maximum price must be greater than minimum price';
    }

    if (!adminAuth.hasMarketPermission(user, formData.market)) {
      newErrors.market = 'You do not have permission to update prices for this market';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert(t('validationError'), t('fixErrors'));
      return;
    }

    setLoading(true);

    try {
      const now = Timestamp.now();
      const sevenDaysFromNow = Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days in milliseconds
      );

      const priceData = {
        ...formData,
        source: user.username,
        verified: true,
        lastUpdated: now,
        expiresAt: sevenDaysFromNow, // Auto-delete after 7 days
      };

      if (priceToEdit) {
        // Update existing price
        await updateDoc(doc(db, COLLECTIONS.COFFEE_PRICES, priceToEdit.id), priceData);
        Alert.alert(t('success'), t('priceUpdatedSuccessfully'));
      } else {
        // Add new price
        await addDoc(collection(db, COLLECTIONS.COFFEE_PRICES), priceData);
        Alert.alert(t('success'), t('newPriceAddedSuccessfully'));
      }

      await sendPushNotifications(priceData);

      onSave();
    } catch (error) {
      console.error('Error saving price:', error);
      Alert.alert(t('error'), t('failedToSavePrice'));
    } finally {
      setLoading(false);
    }
  };

  const sendPushNotifications = async (priceData: any) => {
    try {
      // Get backend server URL from environment or use default
      const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

      // Send notification request to backend server
      const response = await fetch(`${BACKEND_URL}/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceData }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Notifications sent successfully');
        console.log(`📨 FCM: ${result.fcmSent || 0}, Expo: ${result.expoSent || 0}, Total: ${result.totalSent || 0}`);
        if (result.totalFailed > 0) {
          console.log(`❌ Failed: ${result.totalFailed}`);
        }
        if (result.invalidTokensRemoved > 0) {
          console.log(`🗑️ Removed ${result.invalidTokensRemoved} invalid tokens`);
        }
      } else {
        console.error('❌ Notification error:', result.error);
      }
    } catch (error) {
      console.error('Error sending push notifications:', error);
      // Don't throw error - allow price save to complete even if notifications fail
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        t('unsavedChanges'),
        t('unsavedChangesMessage'),
        [
          { text: t('keepEditing'), style: 'cancel' },
          { text: t('discardChanges'), style: 'destructive', onPress: onCancel },
        ]
      );
    } else {
      onCancel();
    }
  };

  const hasUnsavedChanges = (): boolean => {
    if (!priceToEdit) {
      return Object.values(formData).some(value =>
        typeof value === 'number' ? value > 0 : value !== formData.breed && value !== formData.quality
      );
    }

    return (
      formData.breed !== priceToEdit.breed ||
      formData.market !== priceToEdit.market ||
      formData.minPrice !== priceToEdit.minPrice ||
      formData.maxPrice !== priceToEdit.maxPrice ||
      formData.quality !== priceToEdit.quality
    );
  };

  const FilterChip = ({
    label,
    isActive,
    onPress,
    disabled = false
  }: {
    label: string;
    isActive: boolean;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && styles.filterChipActive,
        disabled && styles.filterChipDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.filterChipText,
        isActive && styles.filterChipTextActive,
        disabled && styles.filterChipTextDisabled,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title={priceToEdit ? t('editPrice') : t('addNewPrice')}
        subtitle={undefined}
        leftComponent={
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Form Title */}
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{t('priceInformation')}</Text>
            <Text style={styles.formSubtitle}>
              {t('enterLatestMarketPriceDetails')}
            </Text>
          </View>

          {/* Market Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{t('marketRequired')}</Text>
            <View style={styles.chipsContainer}>
              {availableMarkets.map(market => (
                <FilterChip
                  key={market}
                  label={market}
                  isActive={formData.market === market}
                  onPress={() => updateField('market', market)}
                />
              ))}
            </View>
            {errors.market && (
              <Text style={styles.errorText}>{errors.market}</Text>
            )}
          </View>

          {/* Breed Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{t('coffeeVarietyRequired')}</Text>
            <View style={styles.chipsContainer}>
              {(['Arabica Parchment', 'Arabica Cherry', 'Robusta Parchment', 'Robusta Cherry'] as const).map(breed => (
                <FilterChip
                  key={breed}
                  label={t(`breed_${breed}`)}
                  isActive={formData.breed === breed}
                  onPress={() => updateField('breed', breed)}
                />
              ))}
            </View>
          </View>

          {/* Quality Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{t('qualityGradeRequired')}</Text>
            <View style={styles.chipsContainer}>
              {(['A', 'B', 'C'] as const).map(quality => (
                <FilterChip
                  key={quality}
                  label={t(`grade${quality}`)}
                  isActive={formData.quality === quality}
                  onPress={() => updateField('quality', quality)}
                />
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.priceRangeContainer}>
            <View style={styles.priceRangeColumn}>
              <Text style={styles.inputLabel}>{t('minimumPrice')}</Text>
              <View style={[styles.inputWrapper, errors.minPrice && styles.inputError]}>
                <Ionicons name="remove-circle-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  value={formData.minPrice.toString()}
                  onChangeText={(text) => updateField('minPrice', parseFloat(text) || 0)}
                  placeholder={t('minPrice')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              {errors.minPrice && (
                <Text style={styles.errorText}>{errors.minPrice}</Text>
              )}
            </View>

            <View style={styles.priceRangeColumn}>
              <Text style={styles.inputLabel}>{t('maximumPrice')}</Text>
              <View style={[styles.inputWrapper, errors.maxPrice && styles.inputError]}>
                <Ionicons name="add-circle-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  value={formData.maxPrice.toString()}
                  onChangeText={(text) => updateField('maxPrice', parseFloat(text) || 0)}
                  placeholder={t('maxPrice')}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              {errors.maxPrice && (
                <Text style={styles.errorText}>{errors.maxPrice}</Text>
              )}
            </View>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('priceSummary')}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('marketLabel')}</Text>
              <Text style={styles.summaryValue}>{formData.market}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('breedLabel')}</Text>
              <Text style={styles.summaryValue}>{t(`breed_${formData.breed}`)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('qualityLabel')}</Text>
              <Text style={styles.summaryValue}>Grade {formData.quality}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('priceRangeLabel')}</Text>
              <Text style={styles.summaryValue}>
                ₹{formData.minPrice} - ₹{formData.maxPrice}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>
                    {priceToEdit ? t('updatePrice') : t('addPrice')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },

  // Content
  content: {
    flex: 1,
  },

  // Form
  formContainer: {
    padding: 20,
  },
  formHeader: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },

  // Input Sections
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextDisabled: {
    color: '#9CA3AF',
  },

  // Price Range
  priceRangeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  priceRangeColumn: {
    flex: 1,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  summaryHighlight: {
    color: '#3B82F6',
    fontSize: 16,
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});