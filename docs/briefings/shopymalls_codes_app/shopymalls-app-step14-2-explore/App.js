import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Image, StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const C = {
  bg: "#050505", surface: "#101010", surface2: "#151515",
  line: "#2A2A2A", white: "#F6F6F6", muted: "#A3A3A3", lime: "#B8F500"
};

const MALLS = [
  { name: "Grand Indonesia", city: "Jakarta Pusat", stores: "300+ stores", deals: "42 deals",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85" },
  { name: "Plaza Indonesia", city: "Jakarta Pusat", stores: "150+ stores", deals: "27 deals",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85" },
  { name: "Central Park", city: "Jakarta Barat", stores: "300+ stores", deals: "35 deals",
    image: "https://images.unsplash.com/photo-1567449303078-57ad995bd17b?auto=format&fit=crop&w=1200&q=85" }
];

const DEALS = [
  { brand: "NIKE", offer: "UP TO 50% OFF", mall: "Grand Indonesia",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85" },
  { brand: "ZARA", offer: "SALE UP TO 50%", mall: "Central Park",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85" },
  { brand: "SEPHORA", offer: "SPECIAL OFFER", mall: "Plaza Indonesia",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85" }
];

const STORES = ["ZARA", "H&M", "NIKE", "UNIQLO", "SEPHORA", "ADIDAS", "NEW BALANCE"];
const CATEGORIES = ["Fashion", "Sneakers & Sports", "Beauty", "Electronics", "Food & Beverage", "Lifestyle", "Kids", "Luxury"];

function Logo() {
  return (
    <View style={s.logoRow}>
      <View style={s.logoIcon}>
        <View style={s.bars}>
          <View style={[s.bar, {height: 14}]} />
          <View style={[s.bar, {height: 23}]} />
          <View style={[s.bar, {height: 18}]} />
        </View>
      </View>
      <View>
        <Text style={s.logo}>shopy<Text style={{color:C.lime}}>malls</Text></Text>
        <Text style={s.tag}>Where shopping happens</Text>
      </View>
    </View>
  );
}

function SectionHeader({ icon, title, action = "Bekijk alles" }) {
  return (
    <View style={s.hdr}>
      <View style={s.ht}>
        <Ionicons name={icon} size={18} color={C.lime}/>
        <Text style={s.st}>{title}</Text>
      </View>
      <Text style={s.all}>{action}</Text>
    </View>
  );
}

function BottomNav({ active, onChange }) {
  const items = [["home","Home"],["search","Explore"],["bookmark","Saved"],["person","Profile"]];
  return (
    <View style={s.nav}>
      {items.map(([key,label]) => (
        <TouchableOpacity key={key} style={s.ni} onPress={() => onChange(key)}>
          <Ionicons name={active===key ? key : `${key}-outline`} size={23} color={active===key ? C.lime : C.white}/>
          <Text style={[s.nt, active===key && {color:C.lime}]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function HomeScreen({ go }) {
  const [q,setQ]=useState("");
  const stores=useMemo(()=>q ? STORES.filter(x=>x.toLowerCase().includes(q.toLowerCase())) : STORES,[q]);
  return (
    <>
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <View style={s.top}><Logo/><TouchableOpacity style={s.circle}><Ionicons name="notifications-outline" size={21} color={C.white}/><View style={s.dot}/></TouchableOpacity></View>

        <View style={s.search}>
          <Ionicons name="search-outline" size={23} color={C.muted}/>
          <TextInput value={q} onChangeText={setQ} placeholder="Zoek malls, winkels, merken of deals..." placeholderTextColor={C.muted} style={s.input}/>
          <View style={s.searchBtn}><Ionicons name="search" size={18} color={C.bg}/></View>
        </View>

        <SectionHeader icon="location-outline" title="Malls near you"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hor}>
          {MALLS.map(m=><TouchableOpacity key={m.name} style={s.mallCard} onPress={()=>go("mall")}>
            <Image source={{uri:m.image}} style={s.full}/><View style={s.shade}/>
            <View style={s.mc}><Text style={s.mn}>{m.name}</Text><Text style={s.ms}>{m.city}</Text><Text style={s.mm}>{m.stores} · {m.deals}</Text></View>
          </TouchableOpacity>)}
        </ScrollView>

        <SectionHeader icon="flame-outline" title="Today's Hot Deals"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hor}>
          {DEALS.slice(0,2).map(d=><TouchableOpacity key={d.brand} style={s.dealCard} onPress={()=>go("deal")}>
            <Image source={{uri:d.image}} style={s.full}/><View style={s.shade2}/>
            <View style={s.dc}><Text style={s.db}>{d.brand}</Text><Text style={s.do}>{d.offer}</Text><Text style={s.dm}>{d.mall}</Text>
              <View style={s.view}><Text style={s.vt}>VIEW DEAL</Text><Ionicons name="arrow-forward" size={16} color={C.bg}/></View>
            </View>
          </TouchableOpacity>)}
        </ScrollView>

        <SectionHeader icon="sparkles-outline" title="Trending Stores"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hor}>
          {stores.map(x=><TouchableOpacity key={x} style={s.store}><Text style={s.storeTxt}>{x}</Text></TouchableOpacity>)}
        </ScrollView>

        <SectionHeader icon="calendar-outline" title="What's Happening"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.hor}>
          <View style={s.eventCard}><Image source={{uri:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"}} style={s.full}/><View style={s.shade}/><View style={s.ec}><Text style={s.et}>Jakarta Fashion Week</Text><Text style={s.em}>Central Park</Text><Text style={s.ed}>18–25 Aug 2026</Text></View></View>
          <View style={s.eventCard}><Image source={{uri:"https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=85"}} style={s.full}/><View style={s.shade}/><View style={s.ec}><Text style={s.et}>Beauty Pop-up</Text><Text style={s.em}>Plaza Indonesia</Text><Text style={s.ed}>20 Aug – 2 Sep</Text></View></View>
        </ScrollView>
      </ScrollView>
    </>
  );
}

function ExploreScreen({ go }) {
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("Malls");
  const filteredMalls = MALLS.filter(m => !query || `${m.name} ${m.city}`.toLowerCase().includes(query.toLowerCase()));
  const filteredStores = STORES.filter(s => !query || s.toLowerCase().includes(query.toLowerCase()));
  return (
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      <View style={s.exploreTop}>
        <View>
          <Text style={s.exploreEyebrow}>SHOPYMALLS</Text>
          <Text style={s.exploreTitle}>Explore</Text>
        </View>
        <TouchableOpacity style={s.circle}><Ionicons name="options-outline" size={21} color={C.white}/></TouchableOpacity>
      </View>

      <View style={s.search}>
        <Ionicons name="search-outline" size={23} color={C.muted}/>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search malls, stores, brands & deals" placeholderTextColor={C.muted} style={s.input}/>
        <View style={s.searchBtn}><Ionicons name="search" size={18} color={C.bg}/></View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
        {["Malls","Stores","Deals","Events"].map(x=>(
          <TouchableOpacity key={x} onPress={()=>setFilter(x)} style={[s.filterPill, filter===x && s.filterPillActive]}>
            <Text style={[s.filterText, filter===x && s.filterTextActive]}>{x}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionHeader icon="business-outline" title="Explore Malls"/>
      <View style={s.grid}>
        {filteredMalls.map(m=><TouchableOpacity key={m.name} style={s.exploreMall} onPress={()=>go("mall")}>
          <Image source={{uri:m.image}} style={s.exploreMallImg}/><View style={s.emText}><Text style={s.emn}>{m.name}</Text><Text style={s.emc}>{m.city}</Text><Text style={s.emm}>{m.stores} · {m.deals}</Text></View>
        </TouchableOpacity>)}
      </View>

      <SectionHeader icon="grid-outline" title="Explore by Category"/>
      <View style={s.categoryGrid}>
        {CATEGORIES.map((c,i)=><TouchableOpacity key={c} style={s.categoryCard}>
          <Ionicons name={["shirt-outline","fitness-outline","sparkles-outline","phone-portrait-outline","restaurant-outline","home-outline","happy-outline","diamond-outline"][i]} size={22} color={C.lime}/>
          <Text style={s.categoryText}>{c}</Text>
        </TouchableOpacity>)}
      </View>

      <SectionHeader icon="flame-outline" title="Today's Deals"/>
      {DEALS.map(d=><TouchableOpacity key={d.brand} style={s.dealRow} onPress={()=>go("deal")}>
        <Image source={{uri:d.image}} style={s.dealRowImg}/>
        <View style={s.dealRowInfo}><Text style={s.dealRowBrand}>{d.brand}</Text><Text style={s.dealRowOffer}>{d.offer}</Text><Text style={s.dealRowMall}>{d.mall}</Text></View>
        <Ionicons name="chevron-forward" size={20} color={C.white}/>
      </TouchableOpacity>)}

      <View style={s.mapCard}>
        <View style={s.mapTop}><View><Text style={s.mapTitle}>Malls around you</Text><Text style={s.mapSub}>Ontdek shoppinglocaties in jouw omgeving</Text></View><Ionicons name="map-outline" size={24} color={C.lime}/></View>
        <View style={s.mapArea}>
          <View style={[s.pin,{left:"24%",top:"38%"}]}><Ionicons name="location" size={24} color={C.lime}/></View>
          <View style={[s.pin,{left:"58%",top:"24%"}]}><Ionicons name="location" size={24} color={C.white}/></View>
          <View style={[s.pin,{left:"70%",top:"58%"}]}><Ionicons name="location" size={24} color={C.white}/></View>
          <Text style={s.mapHint}>Tik op een mall om het Mall Profile te openen.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function App(){
  const [screen,setScreen]=useState("home");
  const route=(x)=>{
    if(["home","explore"].includes(x)) setScreen(x);
    else setScreen("explore");
  };
  return <SafeAreaView style={s.safe}><StatusBar barStyle="light-content" backgroundColor={C.bg}/>{screen==="home"?<HomeScreen go={route}/>:<ExploreScreen go={route}/>}<BottomNav active={screen} onChange={setScreen}/></SafeAreaView>;
}

const s=StyleSheet.create({
safe:{flex:1,backgroundColor:C.bg},page:{padding:18,paddingBottom:115},
top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:16},logoRow:{flexDirection:"row",alignItems:"center",gap:9},
logoIcon:{width:37,height:39,borderWidth:2.2,borderColor:C.lime,borderRadius:9,justifyContent:"flex-end",alignItems:"center",paddingBottom:4},bars:{flexDirection:"row",alignItems:"flex-end",gap:2},bar:{width:5,backgroundColor:C.lime,borderRadius:1},
logo:{color:C.white,fontWeight:"800",fontSize:24,letterSpacing:-.8},tag:{color:C.muted,fontSize:9,letterSpacing:.5,marginTop:-2},
circle:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:C.line,alignItems:"center",justifyContent:"center",backgroundColor:C.surface},dot:{position:"absolute",right:8,top:8,width:6,height:6,borderRadius:3,backgroundColor:C.lime},
search:{height:62,borderRadius:19,backgroundColor:C.surface,borderWidth:1,borderColor:C.line,flexDirection:"row",alignItems:"center",paddingLeft:15,paddingRight:7,marginBottom:18},
input:{flex:1,color:C.white,marginLeft:9,fontSize:14},searchBtn:{width:48,height:48,backgroundColor:C.lime,borderRadius:15,alignItems:"center",justifyContent:"center"},
hdr:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:10,marginTop:4},ht:{flexDirection:"row",alignItems:"center",gap:7},st:{color:C.white,fontSize:17,fontWeight:"800"},all:{color:C.lime,fontSize:12,fontWeight:"700"},
hor:{marginBottom:18},mallCard:{width:250,height:205,borderRadius:18,overflow:"hidden",marginRight:10,borderWidth:1,borderColor:C.line},full:{width:"100%",height:"100%"},shade:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:"rgba(0,0,0,.34)"},
mc:{position:"absolute",left:13,right:13,bottom:14},mn:{color:C.white,fontWeight:"900",fontSize:17},ms:{color:"#D5D5D5",fontSize:11,marginTop:2},mm:{color:C.white,fontSize:11,marginTop:6},
dealCard:{width:315,height:225,borderRadius:18,overflow:"hidden",marginRight:11,borderWidth:1,borderColor:C.line},shade2:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:"rgba(0,0,0,.44)"},dc:{position:"absolute",left:16,right:16,top:16,bottom:16},db:{color:C.white,fontSize:20,fontWeight:"900"},do:{color:C.lime,fontSize:28,fontWeight:"900",marginTop:2},dm:{color:C.white,fontSize:12,marginTop:4},view:{position:"absolute",bottom:0,height:42,borderRadius:12,backgroundColor:C.lime,paddingHorizontal:14,flexDirection:"row",alignItems:"center",gap:8},vt:{color:C.bg,fontWeight:"900",fontSize:11},
store:{minWidth:108,height:62,paddingHorizontal:18,borderRadius:18,borderWidth:1,borderColor:C.line,backgroundColor:C.surface,alignItems:"center",justifyContent:"center",marginRight:8},storeTxt:{color:C.white,fontWeight:"900",fontSize:15},
eventCard:{width:220,height:180,borderRadius:17,overflow:"hidden",marginRight:10,borderWidth:1,borderColor:C.line},ec:{position:"absolute",left:13,right:13,bottom:12},et:{color:C.white,fontSize:16,fontWeight:"900"},em:{color:"#D6D6D6",fontSize:11,marginTop:3},ed:{color:C.lime,fontSize:11,marginTop:5,fontWeight:"700"},
nav:{position:"absolute",left:14,right:14,bottom:10,height:70,borderRadius:24,backgroundColor:"#101010",borderWidth:1,borderColor:C.line,flexDirection:"row",alignItems:"center",justifyContent:"space-around"},ni:{width:80,alignItems:"center",justifyContent:"center",gap:3},nt:{color:C.muted,fontSize:10.5,fontWeight:"600"},
exploreTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:14},exploreEyebrow:{color:C.lime,fontWeight:"800",fontSize:10,letterSpacing:1.1},exploreTitle:{color:C.white,fontSize:30,fontWeight:"900",marginTop:2},
filterScroll:{marginBottom:18},filterPill:{height:42,paddingHorizontal:17,borderRadius:21,borderWidth:1,borderColor:C.line,backgroundColor:C.surface,alignItems:"center",justifyContent:"center",marginRight:8},filterPillActive:{backgroundColor:C.lime,borderColor:C.lime},filterText:{color:C.white,fontWeight:"700",fontSize:12},filterTextActive:{color:C.bg},
grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",marginBottom:18},exploreMall:{width:"48.5%",backgroundColor:C.surface,borderWidth:1,borderColor:C.line,borderRadius:16,overflow:"hidden",marginBottom:10},exploreMallImg:{width:"100%",height:108},emText:{padding:10},emn:{color:C.white,fontWeight:"800",fontSize:13},emc:{color:C.muted,fontSize:10,marginTop:2},emm:{color:C.lime,fontSize:10,marginTop:5,fontWeight:"700"},
categoryGrid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",marginBottom:18},categoryCard:{width:"48.5%",minHeight:72,borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.surface,marginBottom:10,padding:12,flexDirection:"row",alignItems:"center",gap:10},categoryText:{color:C.white,fontWeight:"700",fontSize:12.5},
dealRow:{borderRadius:16,borderWidth:1,borderColor:C.line,backgroundColor:C.surface,marginBottom:10,padding:8,flexDirection:"row",alignItems:"center"},dealRowImg:{width:78,height:78,borderRadius:12},dealRowInfo:{flex:1,paddingHorizontal:10},dealRowBrand:{color:C.white,fontWeight:"900",fontSize:14},dealRowOffer:{color:C.lime,fontWeight:"900",fontSize:13,marginTop:2},dealRowMall:{color:C.muted,fontSize:10,marginTop:3},
mapCard:{borderRadius:18,borderWidth:1,borderColor:C.line,backgroundColor:C.surface,padding:13,marginTop:4},mapTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:10},mapTitle:{color:C.white,fontWeight:"900",fontSize:15},mapSub:{color:C.muted,fontSize:10,marginTop:2},mapArea:{height:190,borderRadius:14,backgroundColor:"#0B0F0B",overflow:"hidden",position:"relative",borderWidth:1,borderColor:"#1D2A17"},pin:{position:"absolute"},mapHint:{position:"absolute",left:12,bottom:10,color:C.muted,fontSize:10}
});
