"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient";
import { login, signUp, logout, getCurrentUser } from "../lib/auth"; // Update the path to the correct location

// Matrice di dati iniziale
const initialMatrixData = [
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

export default function Page() {
  const [status, setStatus] = useState("");
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const [weekId, setWeekId] = useState<number>(1);
  const [currentMatrix, setCurrentMatrix] = useState<string[][]>(initialMatrixData);

  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) setUser(session.user);
        else setUser(null);
      });
      return () => authListener?.subscription?.unsubscribe && authListener.subscription.unsubscribe();
    };
    checkSession();
  }, []);

  // Funzioni di autenticazione
  const handleLogin = async (email: string, password: string) => {
    const { user, error } = await login(email, password);
    if (error) {
      setAuthError(error);
      setAuthSuccess("");
    } else {
      setUser(user);
      setAuthError("");
      setAuthSuccess("Login effettuato con successo!");
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    const { user, error } = await signUp(email, password);
    if (error) {
      setAuthError(error);
      setAuthSuccess("");
    } else {
      setUser(user);
      setAuthError("");
      setAuthSuccess("Registrazione effettuata con successo!");
    }
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      setAuthError(error);
    } else {
      setUser(null);
      setAuthError("");
      setAuthSuccess("Logout effettuato con successo!");
    }
  };

  // Aggiorna le date di una riga
  const updateDates = (dates: string[], increment = 1) => {
    return dates.map((dateString) => {
      if (dateString === "") return dateString;
      const [datePart, dayName = ""] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");
      const newDate = new Date(`${year}-${month}-${day}`);
      newDate.setDate(newDate.getDate() + 7 * increment);

      const weekday = newDate.toLocaleDateString("it-IT", { weekday: "short" });
      const formattedDate = newDate.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${formattedDate} ${weekday || dayName}`;
    });
  };

  // Ruota la prima colonna delle sigle
  const rotateSigle = (matrix: string[][], reverse = false) => {
    const newMatrix = [...matrix];
    const firstColumn = newMatrix.slice(1).map((row) => row[0]);
    let rotatedSigle;
    if (reverse) {
      rotatedSigle = [...firstColumn.slice(1), firstColumn[0]];
    } else {
      rotatedSigle = [firstColumn[firstColumn.length - 1], ...firstColumn.slice(0, -1)];
    }
    newMatrix.slice(1).forEach((row, index) => {
      row[0] = rotatedSigle[index] || "";
    });
    return newMatrix;
  };

  // Inserisci la matrice nella tabella "matrix"
  const insertMatrix = async (matrix: string[][], week: number) => {
    const updates = matrix.flatMap((row, rowIndex) =>
      row.map((cell, columnIndex) => ({
        week_id: week,
        row_id: rowIndex,
        column_id: columnIndex,
        value: columnIndex === 0 && rowIndex === 0 ? "" : cell,
      }))
    );
    const { data, error } = await supabase.from("matrix").insert(updates);
    if (error) {
      setStatus(`Errore: ${error.message}`);
      console.error("Errore inserimento:", error);
    } else {
      setStatus("Dati inseriti con successo!");
      console.log("Dati inseriti:", data);
      fetchData();
    }
  };

  // Elimina i record di una settimana
  const deleteWeek = async (week: number) => {
    try {
      const { error } = await supabase.from("matrix").delete().eq("week_id", week);
      if (error) {
        setStatus(`Errore: ${error.message}`);
        console.error("Errore cancellazione:", error);
      } else {
        setStatus(`Dati della settimana ${week} cancellati con successo!`);
        console.log(`Dati cancellati per week_id: ${week}`);
      }
    } catch (err) {
      setStatus(`Errore imprevisto: ${err}`);
      console.error("Errore non previsto durante la cancellazione:", err);
    }
  };

  // Avanza di una settimana
  const nextWeek = async () => {
    try {
      const newWeekId = weekId + 1;
      setWeekId(newWeekId);
      const updatedDates = updateDates(currentMatrix[0], 1);
      const rotatedMatrix = rotateSigle(currentMatrix, false);
      rotatedMatrix[0] = updatedDates;
      setCurrentMatrix(rotatedMatrix);
      await insertMatrix(rotatedMatrix, newWeekId);
    } catch (err) {
      setStatus(`Errore imprevisto: ${err}`);
      console.error("Errore non previsto:", err);
    }
  };

  // Torna alla settimana precedente
  const previousWeek = async () => {
    try {
      if (weekId > 1) {
        await deleteWeek(weekId);
        const newWeekId = weekId - 1;
        setWeekId(newWeekId);
        const { data, error } = await supabase
          .from("matrix")
          .select("*")
          .eq("week_id", newWeekId)
          .order("row_id", { ascending: true })
          .order("column_id", { ascending: true });
        if (error) {
          setStatus(`Errore: ${error.message}`);
          console.error("Errore recupero:", error);
          return;
        }
        if (data && data.length > 0) {
          const prevMatrix: string[][] = [];
          data.forEach((item) => {
            if (!prevMatrix[item.row_id]) prevMatrix[item.row_id] = [];
            prevMatrix[item.row_id][item.column_id] = item.value;
          });
          setCurrentMatrix(prevMatrix);
          setStatus("Dati della settimana precedente recuperati con successo!");
        } else {
          setStatus("Nessun dato trovato per la settimana precedente.");
        }
      } else {
        setStatus("Sei già alla prima settimana.");
      }
    } catch (err) {
      setStatus(`Errore imprevisto: ${err}`);
      console.error("Errore non previsto:", err);
    }
  };

  // Recupera i dati di una settimana
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("matrix")
        .select("*")
        .eq("week_id", weekId)
        .order("row_id", { ascending: true })
        .order("column_id", { ascending: true });
      if (error) {
        setStatus(`Errore: ${error.message}`);
        console.error("Errore recupero dati:", error);
      } else {
        setMatrixData(data || []);
        setStatus("Dati recuperati con successo!");
      }
    } catch (err) {
      setStatus(`Errore imprevisto: ${err}`);
      console.error("Errore non previsto:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [weekId]);

  // Rendering
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {!user ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Login / Registrazione</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as HTMLFormElement).email.value;
              const password = (e.target as HTMLFormElement).password.value;
              handleLogin(email, password);
            }}
            className="space-y-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as HTMLFormElement).email.value;
              const password = (e.target as HTMLFormElement).password.value;
              handleSignUp(email, password);
            }}
            className="space-y-4 mt-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Registrati
            </button>
          </form>
          {authError && <p className="text-red-500 text-center mt-4">{authError}</p>}
          {authSuccess && <p className="text-green-500 text-center mt-4">{authSuccess}</p>}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Benvenuto, {user.email}!</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {user && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
          <h1 className="text-2xl font-bold mb-4">Gestione Matrice</h1>
          <p className={`mb-4 ${status.includes("Errore") ? "text-red-500" : "text-green-500"}`}>
            {status}
          </p>

          <h2 className="text-xl font-bold mb-4">Dati della Matrice</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border border-gray-300"></th>
                  {currentMatrix[0].slice(1).map((date, i) => (
                    <th key={i} className="p-3 border border-gray-300">
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentMatrix.slice(1).map((row, rIndex) => (
                  <tr key={rIndex} className={rIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3 border border-gray-300">{row[0]}</td>
                    {row.slice(1).map((cell, cIndex) => (
                      <td key={cIndex} className="p-3 border border-gray-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => insertMatrix(currentMatrix, weekId)}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Insert in DB
            </button>
            <button
              onClick={nextWeek}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Next Week
            </button>
            <button
              onClick={previousWeek}
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
            >
              Previous Week
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
