import React, {useEffect, useRef, useState} from 'react';
import {userSelector} from '@lovecoding-it/dit-core';
import Button from "../components/Button";
import {StyleSheet, View, FlatList, TouchableOpacity, Text, SectionList, Dimensions} from "react-native";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import SearchBar from 'react-native-platform-searchbar';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Headline from "../components/Headline";
import AccordionEasy from "../widgets/AccordionEasy";
import News from "../components/News";
import {Feather} from "@expo/vector-icons";
import {GWGColors} from "../config/Colors";

import {fetchIssues, issuesSelector} from '@lovecoding-it/dit-core';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function SearchScreen({navigation}) {

    const dispatch = useDispatch()
    const {issues, loading, hasErrors} = useSelector(issuesSelector);

    const {user} = useSelector(userSelector);

    const [value, setValue] = useState('');
    const [allData, setAllData] = useState([]);
    const [allDataList, setAllDataList] = useState([
        {
            title: "FAQS",
            data: []
        },
        {
            title: "NEWS",
            data: []
        },
        {
            title: "Anliegen",
            data: []
        }
    ]);

    useEffect(() => {

        dispatch(fetchIssues());

        const bootstrapAsync = async () => {
            try {
                const faqs = await AsyncStorage.getItem('faqs');
                const news = await AsyncStorage.getItem('news');
                const issues = await AsyncStorage.getItem('issues');
                let faqsData = [];
                faqsData = (JSON.parse(faqs).map((item)=>{
                    return {
                        key: 'f'+item.id,
                        title: item.title,
                        text: item.text,
                        content: item.text,
                        type: "faq"
                    }
                }));

                let newsData = [];
                newsData = (JSON.parse(news).map((item)=>{
                    return {
                        key: 'n'+item.id,
                        title: item.title,
                        text: item.text,
                        content: item.text,
                        href: item.href,
                        type: "news"
                    }
                }));

                let issuesData = (JSON.parse(issues).map((item) => {
                    if (item != null) {
                        return {
                            key: 'i' + item.id,
                            id: item.id,
                            title: item.title,
                            content: item.description,
                            type: "issues"
                        }
                    }
                    return [];
                }));



                if (!user.guest) {
                    setAllData(faqsData.concat(newsData).concat(issuesData));
                }
                else {
                    setAllData(faqsData.concat(newsData));
                }


                //console.log('allDDDAAAAAAAAa',faqsData.concat(newsData).concat(issuesData))

            } catch (e) {
                console.log('failed',e)
            }

        };
        bootstrapAsync().then(() => {});
    },[dispatch]);

    useEffect(()=>{
        if(value == ""){
            setAllDataList([
                {
                    title: "FAQS",
                    data: []
                },
                {
                    title: "NEWS",
                    data: []
                },
                {
                    title: "Anliegen",
                    data: []
                }
            ])
        }
        else {
            updateSearch(value)
        }

    },[value])

    const updateSearch = (search) => {
        let t = (allData.filter((item)=>{

            if(item.title != undefined){
                if(item.title.toLowerCase().search(search.toLowerCase())>-1) {
                    return true;
                }
            }
            if(item.content != undefined){
                if(item.content.toLowerCase().search(search.toLowerCase())>-1) {
                    return true;
                }
            }
            return false;

        }));

        let tmp = {
            "faq": [],
            "news": [],
            "issues": [],
        };

        t.forEach((item)=>{
            tmp[item.type].push(item);
        })

        const sectionListData = [
            {
                title: "FAQS",
                data: tmp['faq']
            },
            {
                title: "NEWS",
                data: tmp['news']
            },
            {
                title: "Anliegen",
                data: tmp['issues']
            }
        ]
        setAllDataList(sectionListData)
    };


    const navigate= () => {

    };

    const _renderListItem = ({item, index}) => {
        /*return item.map( (i)=>{
            return (<Text>i.title</Text>)
        })*/
        console.log(item)
        if(item.type == "faq"){
            return (
                <AccordionEasy key={item.id} data={item} />
            )
        }
        if(item.type == "news") {
            return(
                <View key={item.id}><News key={item.id} data={item}/></View>
            )
        }

        if(item.type == "issues"){
            return (
                <TouchableOpacity
                    key={index}
                    activeOpacity = {1}
                    onPress={(event) => {
                        navigation.navigate('IssueDetailScreen', {"issueId": item.id ?? null })
                    }}>

                    <View style={styles.row} >
                        <View style={[styles.listTitleContainer]}><Text style={[styles.listTitle]}>{item.title}</Text></View>
                        <Feather name="chevron-down" size={24} style={styles.listIcon} color="black"/>
                    </View>
                </TouchableOpacity>
            )
        }

        return (<><Text>{item.title}</Text></>)
    };

    return (

        <View style={styles.container}>

            <SectionList
                ListHeaderComponent={
                    <>
                        <Headline text={"Suche"} />
                        <SearchBar
                            value={value}
                            onChan2geText={(value)=>updateSearch(value)}
                            onChangeText={setValue}
                            cancelText={"Abbrechen"}


                        />
                    </>}
                stickySectionHeadersEnabled={true}
                sections={allDataList}
                keyExtractor={(item, index) => item + index}
                //renderItem={({ item }) => <Item title={item} />}
                renderSectionHeader={({ section: { title,data } }) => {
                    if (data.length > 0) {
                         return(  <
                             View style={styles.navigationListHeadlineContainer}>
                            <Text style={styles.navigationListHeadline}>{title}</Text>
                        </View>
                         )
                    }
                }}
                renderItem={_renderListItem}
                //renderItem={({ item }) => <Item title={item} />}
            />

            {/* <FlatList
                ListHeaderComponent={
                    <>
                        <Headline text={"Suche"} />
                        <SearchBar
                            value={value}
                            onChangeText={setValue}

                        />
                    </>}
                dat2a={allDataList}
                renderItem={( item ) => {

                    return item.forEach((i) => {
                        return (
                            <TouchableOpacity
                                activeScale={0.9}
                                key={item.key}
                                tension={50}
                                friction={7}
                                useNativeDriver
                                onPress={() =>
                                    this.props.navigation.navigate("DetailScreen", {
                                        data: i,
                                    })
                                }
                            >
                                <View style={{ left: 10, top: 20, marginBottom: 20 }}>
                                    <Text>{i.type} - {i.title} - {i.content}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })

                    return (<></>)

                }}
            />
            */}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#ffffff",
        flex: 1
    },
    searchBar: {
        backgroundColor: '#fff',
        padding: 10
    },
    row:{
        flexDirection: 'row',
        justifyContent:'flex-start',
        paddingLeft:0,
        paddingRight:0,
        alignItems:'flex-start',
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
        padding: 20,
        margin: 10,
        marginLeft: 30,
        marginRight: 30,
        marginBottom:10,
        borderWidth: 0
    },
    listTitleContainer: {
        borderWidth: 0,
        width: screenWidth-100
    },
    listTitle: {
        fontSize: 18,
        //fontWeight: "bold",
        alignSelf: "flex-start",
        color: GWGColors.TEXT

    },
    listIcon: {
        borderWidth: 1.4,
        borderColor: "#b6b6b6",
        color: "#b6b6b6",
    },
    navigationListContainer: {
        marginBottom: 10
    },
    navigationListHeadlineContainer: {
        borderColor: "#1E3259",
        borderBottomWidth:0,
        borderBottomColor: "#b6b6b6",
        backgroundColor: "#ffffff",
        marginBottom: 30,
        marginLeft: 0,
        marginRight: 0,
    },
    navigationListHeadline: {
        fontSize: 24,
        fontWeight: "200",
        color: GWGColors.GWGBLUE,
        paddingLeft: 30,
        marginTop: 20,
        paddingBottom: 10,
    }
});