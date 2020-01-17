import { StyleSheet } from "react-native";
// pantone acquamarine 4ec5a5
// coral color f5fcff
const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: "#f5fcff"
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
    backgroundColor: "#4ec5a5"
  },
  heading: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
    color: "#fff"
  },
  enableInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listContainer: {
    borderColor: "#ccc",
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    height: "auto",
    paddingHorizontal: 16,
    borderColor: "#ccc",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15
  },
  listItemStatus: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
    fontWeight: "bold",
    fontSize: 12,
    color: "#fff"
  },
  footer: {
    height: 52,
    borderTopWidth: 1,
    borderTopColor: "#999"
  },
  fixedFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  buttonView: {
    height: 600,
    margin: 5,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  startButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: "#22509d",
    fontWeight: "bold",
    fontSize: 14
  },
  buttonRaised: {
    backgroundColor: "#22509d",
    borderRadius: 2,
    elevation: 2
  },

  // dashboard
  // animation
  showRing: {
    opacity: 1
  },
  hideRing: {
    opacity: 0,
  },
  cyclesSection: {
    height: 250,
    paddingLeft: 120,
    paddingTop: 50
  },
  outsideRingCyclesSection: {
    height: 150,
    width: 150,
    borderColor: '#4ec5a5',
    opacity: 0.5,
    borderWidth: 17,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 50,
    shadowOpacity: 0.50,
    borderRadius: 100 
  },
  insideRingsContainerCyclesSection: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row' 
  },
  insideRingCyclesSection: {
    margin: 2,
    marginTop: 43,
    height: 25,
    width: 25,
    backgroundColor: '#4ec5a5',
    borderRadius: 50
  },
  insideRingWithOpacityCyclesSection: {
    margin: 2,
    marginTop: 43,
    height: 25,
    width: 25,
    backgroundColor: '#4ec5a5',
    borderRadius: 50,
    opacity: 0.5,
  },
  testSection: {
    height: 70,
  },
  testContainerSection: {
    marginLeft: 120,
  },
  buttonTestSection: {
    backgroundColor: 'white',
    borderColor: '#4ec5a5',
    borderWidth: 2,
    width: 150,
    height: 50,
    paddingLeft: 60,
    paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
  statsSection: {
    height: 350,
    paddingLeft: 50,
  },
  stressStatsSection: {
    width: 300,
    height: 100,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imageStressStatsSection: {
    width: 70,
    height: 70,
    resizeMode: 'stretch'
  },
  textStressStatsSection: {
    textTransform: 'uppercase',
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 25
  },
  othersStatsSection: {
    width: 300,
    height: 200,
    borderColor: 'lightgrey',
    backgroundColor: '#DCDCDC',
    borderWidth: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  centerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconsContainer: {
    paddingTop: 15,
    fontWeight: 'bold',
    opacity: 1,
    flex: 1,
    flexDirection:"column",
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  centerIcons: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 50
  },
  imageIcon: {
    width: 35,
    height: 35,
    resizeMode: 'stretch'
  },
  centerTextIcon: {
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5
  },

  // 3d hand view
  hand3dContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;
