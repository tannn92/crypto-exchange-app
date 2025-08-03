import React, { createContext, useState, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [screenStack, setScreenStack] = useState(['Home']);
  const [modalStack, setModalStack] = useState([]);
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenStack([...screenStack, screen]);
    setScreenParams({ ...screenParams, [screen]: params });
  };

  const goBack = () => {
    if (modalStack.length > 0) {
      // Close modal first
      const newModalStack = [...modalStack];
      newModalStack.pop();
      setModalStack(newModalStack);
    } else if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop();
      const prevScreen = newStack[newStack.length - 1];
      setScreenStack(newStack);
      setCurrentScreen(prevScreen);
    }
  };

  const openModal = (modalName, params = {}) => {
    setModalStack([...modalStack, { name: modalName, params }]);
  };

  const closeModal = () => {
    if (modalStack.length > 0) {
      const newModalStack = [...modalStack];
      newModalStack.pop();
      setModalStack(newModalStack);
    }
  };

  const getParams = (screen) => {
    return screenParams[screen] || {};
  };

  const navigation = {
    navigate,
    goBack,
    openModal,
    closeModal,
    getParams,
    currentScreen,
    modalStack,
  };

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};