
// Matrice iniziale
export const matrix = [
  ["", "01/12/2024 dom", "02/12/2024 lun", "03/12/2024 mar", "04/12/2024 mer", "05/12/2024 gio", "06/12/2024 ven", "07/12/2024 sab"],
  ["BO", "RI", "8.00", "05.55+", "05.55", "06.30", "05.55", "NL"],
  ["AA", "NL", "11.30", "11.30+", "06.30", "8.00", "06.30", "RI"],
  ["CP", "NL", "15.55", "11.30", "15.55", "11.30", "RI", "11.30+"],
  ["CT", "11.30", "15.55", "11.30", "NL", "RI", "05.00+", "00.00"],
  ["CH", "00.00", "00.00", "NL", "RI", "06.30", "06.30", "05.55+"],
  ["CF", "05.55+", "NL", "RI", "8.00", "05.55", "05.55", "05.55"],
  ["DV", "05.55", "RI", "NL", "05.55+", "05.55", "05.55", "09.00"],
  ["AD", "09.00", "RI", "05.55", "09.00+", "09.00", "05.55", "NL"],
  ["DM", "RI", "05.55", "05.55", "05.55", "05.00+", "00.00", "NL"],
  ["FO", "NL", "15.55-", "15.55", "11.30", "11.30", "11.30", "RI"],
  ["GM", "NL", "05.55", "05.00+", "00.00", "00.00", "RI", "09.00"],
  ["IT", "09.00+", "06.30", "06.30", "06.30", "RI", "NL", "05.55"],
  ["CA", "06.30", "05.00+", "00.00", "RI", "NL", "15.55", "11.30"],
  ["LP", "11.30", "12.45-", "RI", "NL", "11.30", "10.30", "06.30+"],
  ["LG", "15.55", "RI", "12.45-", "15.55", "15.55", "12.45", "NL"],
  ["MA", "RI", "11.30-", "15.55", "12,45", "15.55", "15.55", "NL"],
  ["MO", "NL", "15.55", "15.55", "11.30", "11.30", "11.30-", "RI"],
  ["MI", "NL", "11.30+", "06.30", "05.00", "NL", "RI", "09.00"],
  ["NF", "05.55", "05.55+", "8.00", "NL", "RI", "06.30", "06.30"],
  ["PN", "06.30", "09.00", "NL", "RI", "15.55", "15.55", "15.55-"],
  ["PC", "11.30", "NL", "RI", "15.55", "15.55", "11.30-", "15.55"],
  ["CB", "15.55", "RI", "15.55", "15.55", "12.45-", "15.55", "NL"],
  ["RS", "RI", "14.30", "10.30", "14.30", "10.30", "8.00+", "NL"],
  ["SC", "NL", "06.30", "05.00+", "00.00", "00.00", "00.00", "RI"],
  ["SI", "NL", "05.55", "05.55", "05.55", "06.30+", "RI", "14.30"],
  ["DG", "14.30", "10.30", "06.30+", "05.00", "RI", "NL", "05.00"],
  ["SG", "05.00+", "00.00", "00.00", "RI", "NL", "14.30", "11.30"],
  ["TJ", "09.00", "05.00", "RI", "NL", "05.00", "05.00+", "00.00"],
  ["VE", "00.00", "RI", "14.30", "10.30", "14.30", "11.30-", "NL"]
];

export default function Home() {
  // Funzione per calcolare una nuova data
  const shiftDate = (dateString, days) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // Funzione per andare alla settimana successiva
  const nextWeek = () => {
    setMatrix((prevMatrix) => {
      const newMatrix = prevMatrix.map((row, rowIndex) => {
        if (rowIndex === 0) {
          // Aggiorna le date nella prima riga
          return row.map((cell, index) => {
            if (index === 0) return cell;
            return shiftDate(cell.split(" ")[0], 7) + " " + cell.split(" ")[1];
          });
        } else {
          // Ruota le sigle nella prima colonna
          const newRow = [...row];
          newRow[0] = prevMatrix[rowIndex - 1]?.[0] || prevMatrix[prevMatrix.length - 1][0];
          return newRow;
        }
      });
      newMatrix[1][0] = prevMatrix[prevMatrix.length - 1][0];
      return newMatrix;
    });
  };

  // Funzione per andare alla settimana precedente
  const prevWeek = () => {
    setMatrix((prevMatrix) => {
      const newMatrix = prevMatrix.map((row, rowIndex) => {
        if (rowIndex === 0) {
          // Aggiorna le date nella prima riga
          return row.map((cell, index) => {
            if (index === 0) return cell;
            return shiftDate(cell.split(" ")[0], -7) + " " + cell.split(" ")[1];
          });
        } else {
          // Ruota le sigle nella prima colonna
          const newRow = [...row];
          newRow[0] = prevMatrix[rowIndex + 1]?.[0] || prevMatrix[0][0];
          return newRow;
        }
      });
      newMatrix[newMatrix.length - 1][0] = prevMatrix[1][0];
      return newMatrix;
    });
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4 font-bold">La mia tabella</h1>
      <div className="flex gap-4 mb-4">
        <button
          onClick={prevWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Settimana precedente
        </button>
        <button
          onClick={nextWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Settimana successiva
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 text-center">
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-100">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border px-2 py-1">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}