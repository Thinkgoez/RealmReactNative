import React, { useEffect, useState } from 'react'
import 'react-native-get-random-values';
import * as uuid from 'uuid';
import Realm from 'realm'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

const TaskSchema = {
    name: "Task",
    primaryKey: "_id",
    properties: {
        _id: "string",
        name: "string",
        status: "string?",
    },
};
const RealmContent = () => {
    const [realmInstance, setRealmInstance] = useState(null)
    const [taskItems, setTasks] = useState(null)
    useEffect(async () => {
        try {
            const realm = await Realm.open({
                schema: [TaskSchema],
            })
                .then((res) => {
                    console.log('opened')
                    return res
                })
                .catch((err) => console.log('Open error', err))
            // realm.write(() => {
            //     let id = uuid.v4()
            //     realm.create('Task', { name: 'test', status: 'test', _id: id })
            // })

            const tasks = realm.objects("Task");
            // console.log('realm:', realm)
            console.log('tasks:', tasks)
            setTasks(tasks)
            setRealmInstance(realm)
            // setApp(app)
            return realm.close
        } catch (err) {
            console.log('quickStart error:', err)
        }
    }, [])
    async function takeObjects() {
        console.log('realmInstance', realmInstance)
        if (realmInstance) {
            try {
                const tasks = await realmInstance.objects('Task');
                console.log('took', tasks)
            } catch (err) {
                console.log('take objects error:', err)
            }
        }
    }
    async function createNewTask() {
        if (realmInstance) {
            try {
                let id = uuid.v4()
                realmInstance.write(async () => {
                    let newTask = await realmInstance.create("Task", {
                        _id: id,
                        name: "newTask",
                        status: "Open",
                    });
                    console.log('created')
                });
            } catch (err) {
                console.log('create newTask error:', err)
            }
        }
    }
    async function updateNewTask() {
        let newTask
        if (realmInstance) {
            try {
                realmInstance.write(async () => {
                    newTask = realmInstance.objects("Task").filtered("name = 'newTask'")[0];
                    newTask.status = 'Updated'
                    console.log(newTask)
                    console.log('newTask status:', newTask.status)
                });
            } catch (err) {
                console.log('create newTask error:', err)
            }
        }
    }
    async function removeObj() {
        let newTask
        if (realmInstance) {
            try {
                newTask = realmInstance.objects("Task").filtered("name = 'newTask'")[0];
                realmInstance.write(() => {
                    realmInstance.delete(newTask);
                    console.log('removed')
                });
            } catch (err) {
                console.log('delete newTask error:', err)
            }
        }
    }
    async function getSortedByName() {
        if (realmInstance) {
            try {
                const tasksByName = await realmInstance.objects("Task").sorted("name");
                console.log('tasksByName:', tasksByName.map(el => el.name))
            } catch (err) {
                console.log('tasksByName error:', err)
            }
        }
    }
    return (
        <SafeAreaView>
            <TouchableOpacity onPress={takeObjects}><Text>Load objects</Text></TouchableOpacity>
            <TouchableOpacity onPress={createNewTask}><Text>Create obj</Text></TouchableOpacity>
            <TouchableOpacity onPress={removeObj}><Text>remove obj</Text></TouchableOpacity>
            <TouchableOpacity onPress={updateNewTask}><Text>update obj</Text></TouchableOpacity>
            <TouchableOpacity onPress={getSortedByName}><Text>get sorted by name tasks</Text></TouchableOpacity>
            <Text>{'\n'}</Text>
            {taskItems && taskItems.map(el => <View>
                <Text>Title: {el.name}</Text>
                <Text>Status: {el.status}</Text>
            </View>)}
        </SafeAreaView>
    )
}
export default RealmContent