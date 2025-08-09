// Simple toast implementation using vanilla JS
type ToastType = 'success' | 'error' | 'info';

const showToast = (message: string, type: ToastType = 'info'): void => {
  // Remove any existing toast first
  const existingToast = document.getElementById('toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.id = 'toast-notification';
  
  // Set base classes
  const baseClasses = 'fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white max-w-sm z-50';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];
  
  toastElement.className = `${baseClasses} ${typeClasses}`;
  
  // Create message element
  const messageElement = document.createElement('span');
  messageElement.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'ml-4 text-white hover:text-gray-200';
  closeButton.textContent = '×';
  closeButton.onclick = () => toastElement.remove();
  
  // Create container
  const container = document.createElement('div');
  container.className = 'flex items-center justify-between';
  container.appendChild(messageElement);
  container.appendChild(closeButton);
  
  toastElement.appendChild(container);
  document.body.appendChild(toastElement);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement);
    }
  }, 5000);
};

// Create a simple hook for React components
const useToast = () => {
  return { showToast };
};

export { showToast, useToast };
export default useToast;
