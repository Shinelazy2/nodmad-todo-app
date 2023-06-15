import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Fontisto } from '@expo/vector-icons'
import { StyleSheet, Text, Alert, View, ScrollView, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Pressable, TextInput } from 'react-native';
import {theme} from './color'
import { useEffect, useState } from 'react';

const STORAGE_KEY = '@toDos'
const TABS_KEY = '@tabs'
export default function App() {
  useEffect( () => { loadTabs(), loadTodos() }, [])

  const [ working, setWorking] = useState(true)
  const [text, setText] = useState('')
  const [ toDos, setTodos ] = useState({})

  const saveTabs = async (tabState) => {
    await AsyncStorage.setItem(TABS_KEY, JSON.stringify({tab: tabState}))
  }

  const loadTabs = async () => {
    const s = await AsyncStorage.getItem(TABS_KEY)
    console.log("🚀 ~ file: App.js:23 ~ loadTabs ~ s:", s)
    const tab = JSON.parse(s);
    setWorking(tab.tab)
  }

  const onChangeText = (payload) => { setText(payload)}
  
  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }

  const deleteTodo = async (key) => {
    return Alert.alert('Delete To do?', 'Are You Sure?',[{text:'Cancel', onPress: ''}, {text:'Sure', onPress: async() => {
      const newTodos = {...toDos}
      delete newTodos[key]
      setTodos(newTodos)
      await saveTodos(newTodos)
    }}])

  }

  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setTodos(JSON.parse(s));
  }


  const travel = () => {
    setWorking(false)
    saveTabs(false)
  }
  const work = () => {
    setWorking(true)
    saveTabs(true)
  }
  const addTodo = async () => {
    if(text === '') {
      return
    }
    const newTodos = {...toDos,
        [Date.now()] : { text, working}
    }
    setTodos(newTodos)
    await saveTodos(newTodos)
    console.log(toDos)
    // save to do
    setText('')

  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? 'white' : theme.gray}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.gray : 'white'}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput value={text} onSubmitEditing={addTodo} onChangeText={onChangeText} keyboardType='default' returnKeyType='done' placeholder={working ? 'Add a To Do' : 'Where do you want to go'} style={styles.input}/>

      <ScrollView>
        {Object.keys(toDos).map(key => 
        toDos[key].working === working ? <View style={styles.toDO} key={key}>
          <Text style={styles.todoText}>{ toDos[key].text}</Text>
          <TouchableOpacity onPress={() => {deleteTodo(key)}}>
            <Text>
              <Fontisto name='trash' size={20} color={'red'}></Fontisto>
            </Text>
          </TouchableOpacity>
        </View> : null) }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 18
  },
  toDO: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  todoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
});
