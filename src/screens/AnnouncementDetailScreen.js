import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const AnnouncementDetailScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { title, description, time } = route.params;

  // Generate fake detailed content based on the announcement title
  const generateDetailedContent = (title, description) => {
    if (title.includes('trading pairs')) {
      return {
        header: 'New Trading Pairs Available',
        content: `We're excited to announce the addition of new trading pairs to our platform:

• BNB/VND - Trade Binance Coin against Vietnamese Dong
• SOL/VND - Trade Solana against Vietnamese Dong

These new pairs provide you with more opportunities to diversify your trading portfolio and take advantage of market movements.

**Key Features:**
• Low trading fees (0.1% maker, 0.1% taker)
• High liquidity support
• 24/7 trading availability
• Advanced order types supported

**Getting Started:**
1. Navigate to the trading section
2. Select your preferred trading pair
3. Start trading immediately

For any questions about the new trading pairs, please contact our support team.`,
        tags: ['Trading', 'New Features', 'BNB', 'SOL']
      };
    } else if (title.includes('referral program')) {
      return {
        header: 'Referral Program Launch',
        content: `Our referral program is now live! Invite your friends and earn rewards together.

**How it works:**
• Share your unique referral code with friends
• They sign up and complete their first trade
• You both earn rewards

**Reward Structure:**
• 20% commission on trading fees
• Up to $100 bonus for active referrers
• Additional milestone rewards

**Getting Started:**
1. Go to your profile settings
2. Find your unique referral code
3. Share with friends via social media or direct link
4. Track your earnings in real-time

**Terms & Conditions:**
• Minimum trade volume requirements apply
• Rewards credited within 24 hours
• Program subject to change

Start inviting friends today and maximize your earning potential!`,
        tags: ['Referral', 'Rewards', 'Earnings', 'Community']
      };
    } else if (title.includes('version 1.0.5')) {
      return {
        header: 'Version 1.0.5 Released',
        content: `We've successfully updated CryptoVN to version 1.0.5 with exciting improvements!

**What's New:**
• Enhanced security protocols
• Improved trading interface
• Faster transaction processing
• Better mobile responsiveness

**Bug Fixes:**
• Fixed occasional login issues
• Resolved withdrawal delays
• Improved chart rendering performance
• Fixed notification sync problems

**Performance Improvements:**
• 30% faster app loading times
• Reduced memory usage
• Optimized database queries
• Enhanced API response times

**Security Updates:**
• Two-factor authentication improvements
• Enhanced encryption protocols
• Better fraud detection systems
• Strengthened account protection

The update has been automatically applied to all accounts. No action required from users.`,
        tags: ['Update', 'Security', 'Performance', 'Bug Fixes']
      };
    } else if (title.includes('Security upgrade')) {
      return {
        header: 'Security Upgrade Completed',
        content: `We've completed a major security upgrade to protect your assets and data.

**Enhanced Security Features:**
• Advanced encryption algorithms
• Multi-layer authentication system  
• Real-time fraud monitoring
• Secure cold storage protocols

**What's Protected:**
• All user funds in cold storage
• Personal information encryption
• Transaction data security
• API endpoint protection

**Additional Measures:**
• 24/7 security monitoring
• Automated threat detection
• Regular security audits
• Compliance with international standards

Your account security has been automatically enhanced. We recommend enabling 2FA if you haven't already.`,
        tags: ['Security', 'Protection', 'Encryption', 'Monitoring']
      };
    } else {
      return {
        header: title,
        content: `${description}

This is an important update from the CryptoVN team. We're committed to providing you with the best trading experience possible.

**Key Points:**
• Regular platform improvements
• Enhanced user experience
• Continued security focus
• Community-driven development

**What's Next:**
We're constantly working on new features and improvements. Stay tuned for more updates!

For any questions or support, please contact our customer service team through the app or website.`,
        tags: ['General', 'Updates', 'Information']
      };
    }
  };

  const detailContent = generateDetailedContent(title, description);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Announcement
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CryptoVN Logo */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, { color: theme.textSecondary }]}>
            CryptoVN Official
          </Text>
        </View>

        {/* Content */}
        <View style={[styles.contentCard, { backgroundColor: theme.background }]}>
          <Text style={[styles.contentTitle, { color: theme.textPrimary }]}>
            {detailContent.header}
          </Text>
          
          <Text style={[styles.publishTime, { color: theme.textSecondary }]}>
            Published: {time}
          </Text>

          <Text style={[styles.contentBody, { color: theme.textPrimary }]}>
            {detailContent.content}
          </Text>

          {/* Tags */}
          <View style={styles.tagContainer}>
            {detailContent.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.tagText, { color: theme.primary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.shareButton, { borderColor: theme.border }]}
            onPress={() => {/* Share functionality */}}
          >
            <Ionicons name="share-outline" size={20} color={theme.textPrimary} />
            <Text style={[styles.shareButtonText, { color: theme.textPrimary }]}>
              Share
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homeButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.homeButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 32,
  },
  publishTime: {
    fontSize: 14,
    marginBottom: 16,
  },
  contentBody: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnnouncementDetailScreen;