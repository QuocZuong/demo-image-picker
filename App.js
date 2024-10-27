import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TODO_STORAGE_KEY = "@todos";

export default function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editText, setEditText] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            const storagedTodos = await AsyncStorage.getItem(TODO_STORAGE_KEY);
            setTodos(storagedTodos ? JSON.parse(storagedTodos) : []);
        } catch (error) {
            Alert.alert("Error", "Failed to load todos");
        }
    };

    const saveTodos = async (newTodos) => {
        try {
            await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(newTodos));
            setTodos(newTodos);
        } catch (error) {
            Alert.alert("Error", "Failed to save todos");
        }
    };

    const addTodo = async () => {
        if (newTodo.trim().length === 0) return;

        const newTodos = [
            ...todos,
            {
                id: Date.now().toString(),
                text: newTodo,
            },
        ];

        await saveTodos(newTodos);
        setNewTodo("");
    };

    const updateTodo = async (id) => {
        if (editText.trim().length === 0) return;

        const newTodos = todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo));

        await saveTodos(newTodos);
        setEditingId(null);
        setEditText("");
    };

    const deleteTodo = async (id) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        await saveTodos(newTodos);
    };

    const startEditing = (id, text) => {
        setEditingId(id);
        setEditText(text);
    };

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            {editingId === item.id ? (
                <View style={styles.editContainer}>
                    <TextInput style={styles.editInput} value={editText} onChangeText={setEditText} />
                    <TouchableOpacity style={styles.editButton} onPress={() => updateTodo(item.id)}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.todoContainer}>
                    <Text style={styles.todoText}>{item.text}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => startEditing(item.id, item.text)}>
                            <Text>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteTodo(item.id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Todo List</Text>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={newTodo} onChangeText={setNewTodo} placeholder="Add new todo" />
                <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList data={todos} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.list} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: "white",
    },
    addButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    list: {
        flex: 1,
    },
    todoItem: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    todoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    todoText: {
        flex: 1,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    button: {
        padding: 5,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
    },
    deleteText: {
        color: "white",
    },
    editContainer: {
        flexDirection: "row",
    },
    editInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 5,
        marginRight: 10,
        borderRadius: 5,
    },
    editButton: {
        padding: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
    },
});
