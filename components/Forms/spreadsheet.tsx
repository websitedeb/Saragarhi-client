import { getSession } from "@/hooks/session";
import { Fonts } from "@/hooks/useFont";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { DB_URL } from "../../constants/constants";
import { useSignStore } from "@/hooks/store";

interface Item {
  id: string;
  Team: number;
  Time: string;
  Date: string;
}

interface EditableListProps {
  data: Item[];
  onSave?: (updatedData: Item[]) => void;
  targetName: string | undefined;
}

export default function EditableList({ data, onSave, targetName }: EditableListProps) {
  const { sign } = useSignStore() as { sign: string };
  const [items, setItems] = useState<any>(data);
  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPickerId, setCurrentPickerId] = useState<string | null>(null);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [children, setChildren] = useState<number>(0);

  useEffect(() => {
    setChildren(items.length);
  }, []);

  function updateItem(id: string, key: keyof Item, value: string) {
    setItems((prev: Array<any>) =>
      prev.map((item: any) => (item.id === id ? { ...item, [key]: value } : item))
    );
  }

  function addItem() {
    const newItem: Item = {
      id: Math.random().toString(36).slice(2),
      Team: 0,
      Time: "",
      Date: "",
    };
    setItems((prev: any) => [...prev, newItem]);
    setChildren((prev) => prev + 1);
  }

  function removeItem(id: string) {
    setItems((prev: any) => prev.filter((item: any) => item.id !== id));
    setChildren((prev) => (prev > 0 ? prev - 1 : 0));
  }

  function handleSave() {
    onSave?.(items);
    if (Platform.OS === "web") {
      alert("Saved! " + children.toString());
    } else {
      Alert.alert("Saved!", `You have ${children} times saved. This may take a hot minute to reflect on the profile.`);
    }
    (async () => {
      const res = await fetch(
        `${DB_URL}/updateTimeTable?sign=${sign}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: targetName,
            teamCode: (await getSession())?.TeamCode, 
            timetable: items,
          }),
        }
      );
    })();
  }

  function openTimePicker(id: string, existingTime: string) {
    setCurrentPickerId(id);

    if (existingTime) {
      const [hours, minutes] = existingTime.split(":").map(Number);
      const d = new Date();
      d.setHours(hours);
      d.setMinutes(minutes);
      setPickerDate(d);
    } else {
      setPickerDate(new Date());
    }

    setShowPicker(true);
  }

  function openDatePicker(id: string, existingDate: string) {
    setCurrentPickerId(id);

    if (existingDate) {
      const d = new Date(existingDate);
      setPickerDate(d);
    } else {
      setPickerDate(new Date());
    }

    setShowDatePicker(true);
  }

  function onTimeChange(e: DateTimePickerEvent, selectedDate?: Date) {
  let date: Date | undefined;

  if (Platform.OS === "web") {
    date = e as unknown as Date;
  } else {
    if (e.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    date = selectedDate;
  }

  if (date && currentPickerId) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    updateItem(currentPickerId, "Time", formattedTime);
  }

  setShowPicker(false);
}



  function onDateChange(e: DateTimePickerEvent, selectedDate?: Date) {
    if (e.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate && currentPickerId) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedDate.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;

      updateItem(currentPickerId, "Date", formatted);
    }

    if (Platform.OS !== "ios") setShowDatePicker(false);
  }

  return (
    <View style={styles.container} className="w-96 h-96 self-center rounded-2xl min-h-96">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 0.4 }]}>Date</Text>
            <Text style={[styles.headerCell, { flex: 0.4 }]}>Time</Text>
            <Text style={[styles.headerCell, { flex: 0.4 }]}>Team #</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            {/* DATE */}
            <TouchableOpacity
              style={[styles.cell, { flex: 0.4, marginRight: 6, justifyContent: "center" }]}
              onPress={() => openDatePicker(item.id, item.Date)}
            >
              <Text style={{ color: "white", fontFamily: Fonts.Inter }}>
                {item.Date || "Select Date"}
              </Text>
            </TouchableOpacity>

            {/* TIME */}
            <TouchableOpacity
              style={[styles.cell, { flex: 0.4, marginRight: 6, justifyContent: "center" }]}
              onPress={() => openTimePicker(item.id, item.Time)}
            >
              <Text style={{ color: "white", fontFamily: Fonts.Inter }}>
                {item.Time || "Select Time"}
              </Text>
            </TouchableOpacity>

            {/* TEAM */}
            <TextInput
              style={[styles.cell, { flex: 0.4 }]}
              value={`${item.Team || ""}`}
              placeholder="0"
              onChangeText={(text) => updateItem(item.id, "Team", text)}
              keyboardType="numeric"
            />

            {/* DELETE */}
            <TouchableOpacity style={styles.deleteBtn} onPress={() => removeItem(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#ef4444"/>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* NATIVE TIME PICKER */}
      {Platform.OS !== "web" && showPicker && (
        <DateTimePicker value={pickerDate} mode="time" display="compact" onChange={onTimeChange} />
      )}

      {/* WEB TIME PICKER */}
      {Platform.OS === "web" && showPicker && (
        <TimePickerModal
          visible={showPicker}
          onDismiss={() => {setShowPicker(false)}}
          onConfirm={({hours, minutes}) => {
            const hh = String(hours).padStart(2, "0");
            const mm = String(minutes).padStart(2, "0");
            const formatted = `${hh}:${mm}`;
            if (currentPickerId) {
              updateItem(currentPickerId, "Time", formatted);
            }
            setShowPicker(false);
          }}
          hours={pickerDate.getHours() || 12}
          minutes={pickerDate.getMinutes() || 30}
        />
      )}

      {/* NATIVE DATE PICKER */}
      {Platform.OS !== "web" && showDatePicker && (
        <DateTimePicker value={pickerDate} mode="date" display="calendar" onChange={onDateChange} />
      )}

      {/* WEB DATE PICKER */}
      {Platform.OS === "web" && showDatePicker && (
        <DatePickerModal
          locale="en"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => {setShowDatePicker(false)}}
          date={pickerDate}
          onConfirm={({ date }) => {
            if (!date) {
              setShowDatePicker(false);
              return;
            }
            if (currentPickerId) {
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const dd = String(date.getDate()).padStart(2, "0");
              const formatted = `${yyyy}-${mm}-${dd}`;
              updateItem(currentPickerId, "Date", formatted);
            }
            setShowDatePicker(false);
          }}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={addItem}>
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.addText}>Add Row</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#374151" },

  headerRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 1
  },
  headerCell: {
    fontWeight: "600",
    color: "red",
    fontSize: 15,
    fontFamily: Fonts.Shrikhand,
    textAlign: "center",
  },

  row: {
  flexDirection: "row",
  backgroundColor: "#374151",
  borderWidth: 1,
  borderColor: "red",
  borderRadius: 8,
  padding: 8,
  marginBottom: 8,
  alignItems: "center",
  gap: 4,              
},


  cell: {
  borderColor: "#030712",
  borderWidth: 1,
  borderRadius: 6,
  paddingHorizontal: 8,
  paddingVertical: 10,
  fontSize: 16,
  backgroundColor: "#230001",
  color: "white",
  fontFamily: Fonts.Inter,
  width: 60,          
  minHeight: 40,
  maxHeight: 40,
},

  deleteBtn: {
  marginLeft: 4,
  padding: 4,
  width: 32,          
  alignItems: "center",
  justifyContent: "center",
},


  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ed1c24",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
  },
  saveBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});
