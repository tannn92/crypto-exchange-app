import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const UsernameSelectionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { currentUsername, coin } = route.params || {};

  // Mock saved usernames data
  const savedUsernames = [
    {
      id: '1',
      username: 'hovinhthinh',
      name: 'Ho Vinh Thinh',
    },
    {
      id: '2',
      username: 'nguyentheduy',
      name: 'Nguyen The Duy',
    },
  ];

  const [usernames, setUsernames] = useState(savedUsernames);
  const [isManageMode, setIsManageMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editName, setEditName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');

  // Find the currently selected username based on the current username from send screen
  const getCurrentUsernameId = () => {
    if (!currentUsername) {return null;}
    const foundUsername = savedUsernames.find(user => user.username === currentUsername);
    return foundUsername ? foundUsername.id : null;
  };

  const [selectedUsernameId, setSelectedUsernameId] = useState(getCurrentUsernameId());

  const handleUsernameSelect = (user) => {
    // Close modal first
    navigation.goBack();

    // Navigate back to SendToUserFlow with the selected username
    setTimeout(() => {
      navigation.navigate('SendToUserFlow', {
        screen: 'SendToUser',
        params: {
          selectedUsername: user.username,
          coin: coin, // Pass the coin back
        },
      });
    }, 200);
  };

  const handleManage = () => {
    setIsManageMode(!isManageMode);
  };

  const handleDelete = (user) => {
    Alert.alert(
      'Delete Username',
      `Are you sure you want to delete ${user.username}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsernames(usernames.filter(u => u.id !== user.id));
          },
        },
      ]
    );
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditName(user.name);
    setEditModalVisible(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsernames(usernames.map(u =>
        u.id === editingUser.id
          ? { ...u, username: editUsername, name: editName }
          : u
      ));
      setEditModalVisible(false);
      setEditingUser(null);
    }
  };

  const handleAddNewUsername = () => {
    setNewUsername('');
    setNewName('');
    setAddModalVisible(true);
  };

  const handleAddUser = () => {
    if (newUsername && newName) {
      const newUser = {
        id: Date.now().toString(),
        username: newUsername,
        name: newName,
      };
      setUsernames([...usernames, newUser]);
      setAddModalVisible(false);
      setNewUsername('');
      setNewName('');
    }
  };

  const renderUsernameCard = (user) => (
    <TouchableOpacity
      key={user.id}
      style={[
        styles.usernameCard,
        {
          backgroundColor: theme.backgroundInput,
          borderColor: selectedUsernameId === user.id && !isManageMode ? theme.primary : '#E0E0E0',
        },
      ]}
      onPress={() => !isManageMode && handleUsernameSelect(user)}
      disabled={isManageMode}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardInfoSection}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Username
            </Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              {user.username}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Name
            </Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              {user.name}
            </Text>
          </View>
        </View>

        {isManageMode && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEdit(user)}
            >
              <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(user)}
            >
              <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundForm }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button touched - UsernameSelectionScreen');
            navigation.goBack();
          }}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Select username
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Saved username
          </Text>
          <TouchableOpacity onPress={handleManage}>
            <Text style={[styles.manageButton, { color: theme.primary }]}>
              {isManageMode ? 'Done' : 'Manage'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Username Cards */}
        <View style={styles.usernameList}>
          {usernames.map(renderUsernameCard)}
        </View>

        {/* Add New Username Button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.backgroundInput }]}
          onPress={handleAddNewUsername}
        >
          <Ionicons name="add" size={24} color={theme.textSecondary} />
          <Text style={[styles.addButtonText, { color: theme.textPrimary }]}>
            Add new Username
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContainer, { backgroundColor: theme.backgroundForm }]}>
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: theme.textPrimary }]}>
                Edit Username
              </Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.editModalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Username
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={editUsername}
                  onChangeText={setEditUsername}
                  placeholder="Enter username"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Name
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.editModalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, {
                    backgroundColor: theme.backgroundInput,
                  }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleUpdateUser}
                >
                  <Text style={styles.updateButtonText}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.editModalContainer, { backgroundColor: theme.backgroundForm }]}>
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: theme.textPrimary }]}>
                Add new Username
              </Text>
              <TouchableOpacity
                onPress={() => setAddModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.editModalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Username
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter a username"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Name
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: theme.backgroundInput,
                    color: theme.textPrimary,
                  }]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>

              <View style={styles.editModalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, {
                    backgroundColor: theme.backgroundInput,
                  }]}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleAddUser}
                >
                  <Text style={styles.updateButtonText}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 60,
    alignItems: 'flex-start',
    zIndex: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  manageButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  usernameList: {
    gap: 16,
    marginBottom: 24,
  },
  usernameCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardInfoSection: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  editModalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  updateButton: {
    backgroundColor: '#FF6B35',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
  },
});

export default UsernameSelectionScreen;
