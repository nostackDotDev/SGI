import {
  Document,
  Page,
  Text,
  View,
  // Font,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatDate } from "@/lib/utils";

// Register fonts (optional, uses default if not available)
// Font.register({
//   family: "Helvetica",
//   src: "https://fonts.gstatic.com/s/openscans/v20/ga6iaw1J5X0T9RV6j9bNVlZ2dG1S.woff2",
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    backgroundColor: "#ffffff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3b82f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
  },
  institutionName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 9,
    color: "#6b7280",
  },
  generatedBy: {
    fontSize: 9,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 5,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 15,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 25,
  },
  tableCell: {
    padding: 6,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
  },
  tableCellLeft: {
    padding: 6,
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 9,
  },
  tableCellCenter: {
    padding: 6,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 9,
  },
  tableCellRight: {
    padding: 6,
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    fontSize: 9,
  },
  totalsRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderTopWidth: 2,
    borderTopColor: "#d1d5db",
    fontWeight: "bold",
    fontSize: 10,
    minHeight: 28,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 10,
    fontSize: 8,
    color: "#6b7280",
  },
  pageNumber: {
    fontSize: 8,
    color: "#6b7280",
  },
});

function ReportPDFHeader({ institution, user, generatedAt }) {
  const logo = `${window.location.origin}/logo2.jpg`;
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          src={{
            uri: logo,
          }}
          style={{
            width: 50,
            height: 50,
          }}
          fixed
          cache
        />
        <View style={styles.headerInfo}>
          <Text style={styles.institutionName}>
            {institution?.nome || "SGI"}
          </Text>
          <Text style={{ fontSize: 8, color: "#6b7280" }}>
            Relatório de Inventário
          </Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Text style={{ fontSize: 9 }}>
          {formatDate(generatedAt || new Date(), true)}
        </Text>
        <Text style={styles.generatedBy}>
          Gerado por: {user?.nome || "Utilizador"}
        </Text>
      </View>
    </View>
  );
}

export function ReportPDFDocument({ report, institution, user }) {
  return (
    <Document>
      {/* Categories and Totals Section */}
      <Page size="A4" style={styles.page}>
        <ReportPDFHeader
          institution={institution}
          user={user}
          generatedAt={report?.generatedAt}
        />

        <View>
          <Text style={styles.sectionTitle}>Resumo por Categoria</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={{ ...styles.tableCellLeft, flex: 2 }}>
                <Text>Categoria</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>Total</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>Disponível</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>Emprestado</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>Manutenção</Text>
              </View>
            </View>

            {report?.categories?.map((category, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={{ ...styles.tableCellLeft, flex: 2 }}>
                  <Text>{category.nome}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text>{category.total}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text>{category.available}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text>{category.borrowed}</Text>
                </View>
                <View style={styles.tableCellRight}>
                  <Text>{category.repair}</Text>
                </View>
              </View>
            ))}

            <View style={styles.totalsRow}>
              <View style={{ ...styles.tableCellLeft, flex: 2 }}>
                <Text>Total Geral</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>{report?.totals?.total || 0}</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>{report?.totals?.available || 0}</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>{report?.totals?.borrowed || 0}</Text>
              </View>
              <View style={styles.tableCellRight}>
                <Text>{report?.totals?.repair || 0}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gerado com SGI</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Records/Movements Section */}
      <MovementsPages
        records={report?.records || []}
        institution={institution}
        user={user}
        generatedAt={report?.createdAt}
      />
    </Document>
  );
}

function MovementsPages({ records, institution, user, generatedAt }) {
  const recordsPerPage = 15; // Adjust as needed based on layout and font size
  const pages = [];

  for (let i = 0; i < records.length; i += recordsPerPage) {
    pages.push(records.slice(i, i + recordsPerPage));
  }

  // Always include at least one page for movements
  if (pages.length === 0) {
    pages.push([]);
  }

  const typeConfig = {
    in: "Entrada",
    transfer: "Transferência",
    out: "Saída",
    return: "Devolução",
    borrow: "Empréstimo",
    repair: "Reparação",
    // exit: "Saída",
    reduction: "Redução",
  };

  return pages.map((pageRecords, pageIdx) => (
    <Page key={pageIdx} size="A4" style={styles.page}>
      <ReportPDFHeader
        institution={institution}
        user={user}
        generatedAt={generatedAt}
      />
      <View>
        <Text style={styles.sectionTitle}>
          Movimentações {pageIdx > 0 && `(Página ${pageIdx + 1})`}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={{ ...styles.tableCellLeft, flex: 1.2 }}>
              <Text>Data</Text>
            </View>
            <View style={{ ...styles.tableCellLeft, flex: 2 }}>
              <Text>Item</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Tipo</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Qtd</Text>
            </View>
            <View style={{ ...styles.tableCellLeft, flex: 1.5 }}>
              <Text>Registado por</Text>
            </View>
            <View style={{ ...styles.tableCellLeft, flex: 2 }}>
              <Text>Motivo</Text>
            </View>
          </View>

          {pageRecords.map((record, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={{ ...styles.tableCellLeft, flex: 1.2 }}>
                <Text>{formatDate(record.date)}</Text>
              </View>
              <View style={{ ...styles.tableCellLeft, flex: 2 }}>
                <Text>{record.item?.nome || "N/A"}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{typeConfig[record.type] || record.type}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{record.quantidade}</Text>
              </View>
              <View style={{ ...styles.tableCellLeft, flex: 1.5 }}>
                <Text>{record.utilizador?.nome || "N/A"}</Text>
              </View>
              <View style={{ ...styles.tableCellLeft, flex: 2 }}>
                <Text>{record.reason || "Sem motivo"}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <Text>Gerado com SGI</Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} de ${totalPages}`
          }
        />
      </View> */}
    </Page>
  ));
}
