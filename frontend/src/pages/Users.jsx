import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const funcionario = [
  {
    id: 1,
    name: "Edward Perry",
    age: 25,
    date: "7/16/2025",
    dept: "Finance",
    full: true,
  },
  {
    id: 2,
    name: "Josephine Drake",
    age: 36,
    date: "7/16/2025",
    dept: "Market",
    full: false,
  },
  {
    id: 3,
    name: "Cody Phillips",
    age: 19,
    date: "7/16/2025",
    dept: "Development",
    full: true,
  },
];

export default function Users() {
  return (
    <div className="p-6 text-black">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">FUNCIONARIOS DO KIESSE</h1>
          <h2 className="text-xl">uahhhh uahhh ah ahh ahhhhhh</h2>
        </div>

        <Button className="bg-white text-black hover:bg-gray-200">
          + Create
        </Button>
      </div>

      {/* TABLE */}

      <div className="border border-black-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#2a7984]">
              <TableHead>ID</TableHead>
              <TableHead>NOME</TableHead>
              <TableHead>IDADE</TableHead>
              <TableHead>DATA DE ADESÃO</TableHead>
              <TableHead>DEPARTAMENTO</TableHead>
              <TableHead>NIVEL DE ACESSO</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {funcionario.map((emp) => (
              <TableRow key={emp.id} className="border-black-800">
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.age}</TableCell>
                <TableCell>{emp.date}</TableCell>
                <TableCell>{emp.dept}</TableCell>
                <TableCell>{emp.full ? "ADIM" : "NORMAL"}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
