import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { LineChart } from "@mui/x-charts/LineChart";

export default function AdminDashboard() {
  const [totalFines, setTotalFines] = useState(0);
  const [mostBorrowedItems, setMostBorrowedItems] = useState({});
  const [borrowedItemspertype, setBorrowedItemspertype] = useState({});
  const [popularItems, setPopularItems] = useState([]);
  const [fineovertime, setFineovertime] = useState([]);
  const [membersWithMostBorrowings, setMembersWithMostBorrowings] = useState(
    {},
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(
          "https://localhost:7000/api/ReportRepo/MostBorrowedItem",
        );
        if (!response1.ok) {
          throw new Error(`HTTP Error: ${response1.status}`);
        }
        const data1 = await response1.json();
        console.log("Most Borrowed Items:", data1);
        setMostBorrowedItems(data1);

        const response2 = await fetch(
          "https://localhost:7000/api/ReportRepo/TotalFines",
        );
        if (!response2.ok) {
          throw new Error(`HTTP Error: ${response2.status}`);
        }
        const data2 = await response2.json();
        console.log("Total Fines:", data2);
        setTotalFines(data2.totalFines);

        const response3 = await fetch(
          "https://localhost:7000/api/ReportRepo/BorrowedItemsPerType",
        );
        if (!response3.ok) {
          throw new Error(`HTTP Error: ${response3.status}`);
        }
        const data3 = await response3.json();
        console.log("Borrowed Items Per Type:", data3);
        const book = data3.find((item) => item.itemType === "Book") || {
          totalBorrowed: 0,
        };
        const magazine = data3.find((item) => item.itemType === "Magazine") || {
          totalBorrowed: 0,
        };
        const newspaper = data3.find(
          (item) => item.itemType === "Newspaper",
        ) || { totalBorrowed: 0 };
        setBorrowedItemspertype({
          Book: book,
          Magazine: magazine,
          Newspaper: newspaper,
        });

        const response4 = await fetch(
          "https://localhost:7000/api/ReportRepo/PopularItems",
        );
        if (!response4.ok) {
          throw new Error(`HTTP Error: ${response4.status}`);
        }
        const data4 = await response4.json();
        setPopularItems(data4);

        const response5 = await fetch(
          "https://localhost:7000/api/ReportRepo/FinesOverTime",
        );
        if (!response5.ok) {
          throw new Error(`HTTP Error: ${response5.status}`);
        }
        const data5 = await response5.json();
        const chartData = data5.map((item) => ({
          ...item,
          date: new Date(item.date),
        }));
        setFineovertime(chartData);

        const response6 = await fetch(
          "https://localhost:7000/api/ReportRepo/MembersWithMostBorrowings",
        );
        if (!response6.ok) {
          throw new Error(`HTTP Error: ${response6.status}`);
        }
        const data6 = await response6.json();
        setMembersWithMostBorrowings(data6);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>

    <Grid container spacing={3}>

      {/* Page Header */}
      <Grid size={12}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Overview of library activity and performance
          </Typography>
        </Box>
      </Grid>

      {/* Total Fines */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Paper sx={{ p: 3, height: "100%", borderRadius: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Fines
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            ${totalFines ?? 0}
          </Typography>
        </Paper>
      </Grid>

      {/* Most Borrowed Item */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Paper sx={{ p: 3, height: "100%", borderRadius: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Most Borrowed Item
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            {mostBorrowedItems.title ?? "No data"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {mostBorrowedItems.itemType}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {mostBorrowedItems.borrowCount ?? 0} Borrowings
          </Typography>
        </Paper>
      </Grid>

      {/* Top Member */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Paper sx={{ p: 3, height: "100%", borderRadius: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Member With Most Borrowings
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            {membersWithMostBorrowings.name ?? "No data"}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            {membersWithMostBorrowings.borrowCount ?? 0} Borrowings
          </Typography>
        </Paper>
      </Grid>

      {/* Borrowings Chart */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <Typography variant="h6" fontWeight="bold">
            Borrowed Items Per Type
          </Typography>

          <Divider sx={{ my: 2 }} />

          <BarChart
            xAxis={[
              {
                data: ["Book", "Magazine", "Newspaper"],
                scaleType: "band",
              },
            ]}
            series={[
              {
                label: "Borrowings",
                data: [
                  borrowedItemspertype.Book?.totalBorrowed ?? 0,
                  borrowedItemspertype.Magazine?.totalBorrowed ?? 0,
                  borrowedItemspertype.Newspaper?.totalBorrowed ?? 0,
                ],
              },
            ]}
            height={300}
          />
        </Paper>
      </Grid>

      {/* Fines Chart */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
          <Typography variant="h6" fontWeight="bold">
            Fines Over Time
          </Typography>

          <Divider sx={{ my: 2 }} />

          <LineChart
            xAxis={[
              {
                data: fineovertime.map((item) => item.date),
                scaleType: "time",
                valueFormatter: (date) =>
                  date instanceof Date && !isNaN(date)
                    ? date.toLocaleDateString()
                    : "",
              },
            ]}
            series={[
              {
                label: "Fines",
                data: fineovertime.map((item) =>
                  item.totalFine
                ),
              },
            ]}
            height={300}
            grid={{ vertical: true, horizontal: true }}
          />
        </Paper>
      </Grid>

      {/* Popular Items Table */}
      <Grid size={12}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Popular Items
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Most frequently borrowed library items
          </Typography>

          <TableContainer>
            <Table sx={{ minWidth: 550 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Item Type</TableCell>
                  <TableCell align="right">
                    Borrow Count
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {popularItems.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.itemType}</TableCell>
                    <TableCell align="right">
                      {row.borrowCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

    </Grid>
  </Box>
  );
}
