import React, { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const SwipedTables = () => {
  const containerRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollLeft } = e.target;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '300px' }}>
      <TableContainer component={Paper} onScroll={handleScroll} ref={containerRef}>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              {/* Add more header columns as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Data A</TableCell>
              <TableCell>Data B</TableCell>
              <TableCell>Data C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              {/* Add more data columns as needed */}
            </TableRow>
            {/* Add more rows of data as needed */}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer A</TableCell>
              <TableCell>Footer B</TableCell>
              <TableCell>Footer C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              {/* Add more footer columns as needed */}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} style={{ overflow: 'hidden' }} ref={containerRef}>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              {/* Add more header columns as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Data A</TableCell>
              <TableCell>Data B</TableCell>
              <TableCell>Data C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              {/* Add more data columns as needed */}
            </TableRow>
            {/* Add more rows of data as needed */}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer A</TableCell>
              <TableCell>Footer B</TableCell>
              <TableCell>Footer C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              <TableCell>Header A</TableCell>
              <TableCell>Header B</TableCell>
              <TableCell>Header C</TableCell>
              {/* Add more footer columns as needed */}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SwipedTables;