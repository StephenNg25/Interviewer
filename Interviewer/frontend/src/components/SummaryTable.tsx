import Table from 'react-bootstrap/Table';

interface SummaryTableProps {
    summary: string[];
  }

const SummaryTable: React.FC<SummaryTableProps> = ({summary}) => {
  return (
    <>
    <Table striped = {true} bordered = {true} hover = {true}>
        <thead>
            <tr>
                <th style = {{width : "20px"}}></th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {summary.map((item, index) => (
                <tr key = {index}>
                    <td style = {{backgroundColor : item.substring(0, 3) == 'Bad' ? "rgba(255, 0, 0, 0.4)" : "rgba(0, 255, 21, 0.4)"}}>{item.substring(0, 3) == 'Bad' ? '❌' : '✅'}</td>
                    <td style = {{backgroundColor : item.substring(0, 3) == 'Bad' ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 255, 21, 0.2)"}}>{item.substring(0, 3) == 'Bad' ? item.substring(3) : item.substring(4)}</td>
                </tr>
            ))}  
        </tbody>
    </Table>
  </>
  );

}

export default SummaryTable;

