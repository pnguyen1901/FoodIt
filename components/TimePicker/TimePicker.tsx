import React, { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export const TimePicker = (props) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A time has been picked: ", date);
    hideTimePicker();
  };

  return (
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
  );
};