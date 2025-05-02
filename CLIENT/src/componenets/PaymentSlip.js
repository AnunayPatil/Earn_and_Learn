import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 }
});

const PaymentSlip = ({ entry }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text>Payment Slip for {entry.studentName}</Text>
        <Text>PRN: {entry.prnNumber}</Text>
        <Text>Amount: ₹{entry.amountEarned}</Text>
        <Text>Status: {entry.status}</Text>
      </View>
    </Page>
  </Document>
);