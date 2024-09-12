export const EventItem = ({date, time, title, location, km, Fuel}) => (
  <View style={styles.eventItem}>
    <View style={styles.eventDateTime}>
      <Text style={styles.eventDate}>{date}</Text>
      <Text style={styles.eventTime}>{time}</Text>
    </View>
    <Text style={styles.eventTitle}>{title}</Text>
    <Text style={styles.eventLocation}>{location}</Text>
    <Text style={styles.eventLocation}>{km}</Text>
    <Text style={styles.eventLocation}>{Fuel}</Text>
  </View>
);
