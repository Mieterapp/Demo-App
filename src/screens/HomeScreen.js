import React, {useEffect, useState} from 'react'
//import {useDispatch, useSelector} from 'react-redux'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ImageBackground,
    Linking
} from 'react-native'

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { useScrollToTop } from '@react-navigation/native';

import {fetchNews, newsSelector, fetchFaqs, faqsSelector} from '@lovecoding-it/dit-core';
import {fetchOffers, offersSelector} from '@lovecoding-it/dit-core';
import {fetchContracts, fetchContract, contractsSelector} from '@lovecoding-it/dit-core';
import {getAuthenticatedUser,userSelector} from '@lovecoding-it/dit-core';

import News from '../components/News';
import Accordion from "../widgets/Accordion";
import AccordionEasy from "../widgets/AccordionEasy";
import Notification from "../widgets/Notifications";

import Carousel, { Pagination }  from 'react-native-snap-carousel';
import SegmentedControlTab from "react-native-segmented-control-tab";
import Headline from "../components/Headline";
import WebView from "react-native-webview";
import Button from "../components/Button";
import {GWGColors} from "../config/Colors";
import LoadingScreen from "./LoadingScreen";

function HomeScreen({navigation}) {

    const ref = React.useRef(null);
    useScrollToTop(ref);

    const dispatch = useDispatch()

    const {user} = useSelector(userSelector);
    const {news, loading, hasErrors} = useSelector(newsSelector)
    const {offers, loadingOffers, hasErrorsOffers} = useSelector(offersSelector)
    const {faqs, faqsLoading, faqsHasErrors} = useSelector(faqsSelector)
    const {contracts, loading: loadingContracts, hasErrors: hasErrorsContracts, loadingCurrent, hasErrorsCurrent} = useSelector(contractsSelector);



    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    const [carouselActiveIndex,setCarouselActiveIndex] = useState(0)

    const screenWidth = Math.round(Dimensions.get('window').width);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        dispatch(fetchNews())
        dispatch(fetchOffers())
        dispatch(fetchFaqs())

        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);



    const filterHeaderNews = (news) => {
        var newsArray = [];
        news.forEach((item)=> {
            if(item.show_in_header){
                newsArray.push(item);
            }
        })

        if(contracts.current !== null) {
            const item = {
                type: "Service",
                show_in_header: true,
                title: "Ihre aktuelle Gesamtmiete \n"+contracts.current.condition.total + " EUR / Monat",
                navText: "Details zur Mietzusammensetzung"

            }
            newsArray.push(item);
            newsArray.push({
                type: "Anliegen",
                show_in_header: true,
                title: "Vertrags- /Geschäftspartnersaldo \n"+(contracts.current.condition.prepayment_difference !="" ? contracts.current.condition.prepayment_difference :  "0") + " EUR ",
                navText: "Mein Guthaben auszahlen"
            });
        }
        return newsArray;
    }


    useEffect(() => {
        //dispatch(getAuthenticatedUser());
        if(!user.guest){
            dispatch(getAuthenticatedUser());
        }
        dispatch(fetchNews())
        dispatch(fetchOffers())
        dispatch(fetchFaqs())
        dispatch(fetchContracts());
    }, [dispatch])

    const renderPosts = () => {
        if (loading) return <View style={[styles.loadingContainer, styles.horizontal]}><ActivityIndicator animating = {true}
                                                                                                          color = {GWGColors.GWGBLUE}
                                                                                                          size = "large"
                                                                                                          style = {styles.activityIndicator} /><Text>{loading}</Text></View>
        if (hasErrors) return <Text>Unable to display news.</Text>

        return news.map((newsItem) => {

            if (!newsItem.show_in_header) {
                return (<View key={newsItem.id}><News key={newsItem.id} data={newsItem}/></View>);
            }
            return;
        })
    }

    const renderOffers = () => {

        console.log(offers)

        if (loadingOffers) return <View style={[styles.loadingContainer, styles.horizontal]}><ActivityIndicator animating = {true}
                                                                                                          color = {GWGColors.GWGBLUE}
                                                                                                          size = "large"
                                                                                                          style = {styles.activityIndicator} /><Text>{loading}</Text></View>
        if (hasErrorsOffers) return <Text>Unable to display offers.</Text>

        return offers.map((offerItem) => {
                return (<View key={offerItem.id}><News key={offerItem.id} data={
                    {
                        title: offerItem.title,
                        text: offerItem.text,
                        href: offerItem.website,
                        documents: offerItem.icons
                    }
                }/></View>);
            return;
        })
    }

    const renderFaqs = () => {
        if (faqsLoading) return <View style={[styles.loadingContainer, styles.horizontal]}><ActivityIndicator size="large" color="#00ff00" /><Text>{faqsLoading}</Text></View>
        if (faqsHasErrors) return <Text>Unable to display posts.</Text>

        return faqs.map((faqItem) => {
                return (<AccordionEasy key={faqItem.id} data={faqItem}/>)
                //return (<View><News key={faqItem.id} data={faqItem}/></View>);
        })

    }


    const renderCarouselItem = ({item, index}) => {
        if(item.show_in_header){
            return (
                <View style={{
                    backgroundColor:'#005ca9',
                    borderRadius: 0,
                    height: 270,
                    width: screenWidth,
                    padding: 0,
                    marginLeft: 0,
                    marginRight: 0, }}>
                    {item.documents
                        ? <ImageBackground
                            style={{
                                width: screenWidth,
                                height: 270,
                            }}
                            imageStyle={{opacity:0.5}}
                            source={{
                                uri: item.documents,
                            }}>
                            <View style={{padding: 50, paddingTop: 30}}>
                                <Text style={{fontSize: 24, color: '#ffffff', paddingBottom: 15}} allowFontScaling={true}>{item.title}</Text>
                                <Text style={{fontSize: 16, color: '#ffffff'}} allowFontScaling={true} >{item.text}</Text>
                            </View>
                        </ImageBackground>
                        :<View style={{padding: 50 , paddingTop: 30}}>
                            <Text style={{fontSize: 24, color: '#ffffff', paddingBottom: 15}} allowFontScaling={true} >{item.title}</Text>
                           
                            {item.type ?
                            <>
                                <Button text={item.navText ?? "weiter"} buttonStyle={{backgroundColor: "#ffffff"}} textStyle={{fontSize: 14, color: GWGColors.TEXT}} onPress={()=>navigation.navigate(item.type)}/>
                            </>
                                :
                                <></>
                            }
                        </View>

                    }

                </View>
            );

            return null;
        }
    }

    const  handleIndexChange = index => {
        setSelectedTabIndex(index)
    };

    return (
        <>
        {(!loading & !loadingOffers & !faqsLoading & !loadingContracts) ?

            <>
                <ScrollView ref={ref} style={styles.container} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    <View style={{position: "relative"}}>
                        <Carousel
                            layout={"default"}

                            data={filterHeaderNews(news)}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth}
                            renderItem={renderCarouselItem}
                            onSnapToItem = { index => setCarouselActiveIndex(index) }
                            style={{backgroundColor: 'transparent' }}
                        />
                        <Pagination
                            dotsLength={filterHeaderNews(news).length}
                            activeDotIndex={carouselActiveIndex}

                            containerStyle={{ backgroundColor: 'transparent', top: -60 }}
                            dotStyle={{
                                width: 10,
                                height: 10,

                                borderRadius: 5,
                                marginHorizontal: 8,
                                backgroundColor: 'rgba(255,255,255,1)',
                            }}
                            inactiveDotStyle={{
                                // Define styles for inactive dots here
                                backgroundColor: 'rgba(255,255,255,0.5)'
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>


                    <View style={{marginTop: -50}}>
                        <SegmentedControlTab
                            values={["Neuigkeiten", "Angebote", "FAQ"]}
                            selectedIndex={selectedTabIndex}
                            onTabPress={handleIndexChange}
                            tabStyle={styles.tabStyle}
                            borderRadius={30}

                            activeTabStyle={styles.activeTabStyle}
                            tabTextStyle={styles.tabTextStyle}
                            tabsContainerStyle={{ height: 50, backgroundColor: '#ffffff', margin: 10 }}
                        />

                        {selectedTabIndex === 0
                        && <View>
                            {renderPosts()}
                        </View>
                        }

                        {selectedTabIndex === 1
                        &&  <View style={{padding: 10}}>

                            <View style={[styles.container]}>

                                <Headline text={"Immobilien"}/>

                                <View style={{marginBottom: 20}}>
                                    <Text style={[styles.text]}>
                                        Mit einem Klick auf "aktuelle Angebote" finden Sie unsere neuen Wohnungs- und Stellplatz Angebote:
                                    </Text>
                                </View>

                                <Button text={"Aktuelle Angebote"} onPress={()=>navigation.navigate("RealsEstateOffersScreen")}/>
                            </View>

                            {renderOffers()}

                            
                        </View>}

                        {selectedTabIndex === 2
                        &&  <View style={{marginTop: 30}}>

                            {/*<Accordion

                            title = {"Gruppe alles"}
                            data = {faqs}
                        />*/}

                            {renderFaqs()}
                        </View>}
                    </View>
                    <Notification />
                </ScrollView>
            </>
            :
            <>
                <LoadingScreen />
            </>
        }
        </>


    )
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    },
    tabTextStyle: {
        color: GWGColors.TEXT
    },
    tabStyle: {
        borderColor: '#4a4a4a',
        borderRadius: 30,
        borderWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        //margin: 5,
        backgroundColor: 'transparent'
    },

    activeTabStyle: {
        backgroundColor: GWGColors.TEXT
        //borderRadius: 30
    },
    text: {
        fontSize: 18,
        color: GWGColors.TEXT
    }

});

const htmlStyles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
    b: {
        fontWeight: '800',
        color: '#dd0303',
        display: 'flex',
        flexDirection: 'row',
        fontSize: 18
    },
    p: {
        color: GWGColors.TEXT,
        fontSize: 18
    }
});


export default HomeScreen