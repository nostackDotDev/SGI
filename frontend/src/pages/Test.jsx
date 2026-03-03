import { Boxes, Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://sgi-n6af.onrender.com",
});

export default function Test() {
  const [result, setResult] = useState("");
  const [request, setRequest] = useState(null);

  const handleAPICall = async () => {
    console.log("Fetching");
    const res = await api.get(request).then((res) => {
      console.log("Response", res);
      setResult(JSON.stringify(res.data, null, 2));
    });
  };

  return (
    <main className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-300 to-emerald-950">
      <div className="w-fit h-fit flex items-center justify-center gap-4 absolute top-4 left-1/2 -translate-x-1/2">
        <input
          type="text"
          value={request ?? ""}
          onChange={(e) => setRequest(e.target.value)}
          className="w-2xl p-3 rounded-md bg-white/80 outline-0 border border-blue-200"
placeholder="Caminho base já incluido: http://caminhoDaAPI.com/"
        />
        <button type="button" onClick={handleAPICall} className="w-fit h-fit py-3 px-6 rounded-md bg-neutral-300 shadow-olive-900 shadow-sm cursor-pointer">Requisição</button>
      </div>

      <pre className="h-50 w-[80vw] max-w-4xl border border-neutral-200 bg-white/60 backdrop-blur-lg text-black overflow-hidden overflow-y-scroll wrap-anywhere">
        {result}
      </pre>
    </main>
  );
}
