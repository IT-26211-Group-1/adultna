import { OnboardingData } from '@/types/onboarding';

export const saveOnboardingData = async (data: OnboardingData): Promise<void> => {
  try {
    const response = await fetch('/api/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save onboarding data');
    }
  } catch (error) {
    console.error('Error saving onboarding:', error);
    throw error;
  }
};