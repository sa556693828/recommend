"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePersonaStore } from "@/store/usePersonaStore";
import { personaIconMap } from "@/constants/personaMapping";

const PersonaSelector = ({ isStreaming }: { isStreaming: boolean }) => {
  const { personaId, personas, setPersonaId } = usePersonaStore();
  const [modelPersonaId, setModelPersonaId] = useState(personaId);
  const [modelOpen, setModelOpen] = useState(false);
  const personaName = personas.find(
    (persona) => persona._id === personaId
  )?.persona_name;

  const personaIntro = personas.find(
    (persona) => persona._id === personaId
  )?.intro;
  return (
    <>
      <div className="h-fit p-4 bg-black rounded-lg items-center flex w-full">
        <div className="flex justify-between flex-shrink-0 items-center">
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(personaIconMap).map((icon) => (
              <Image
                key={icon}
                src={personaIconMap[icon]}
                alt="personaIconMap"
                className={`rounded-full ${
                  personaId === icon ? "" : "opacity-30"
                } ${
                  isStreaming
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:opacity-80"
                }`}
                width={40}
                height={40}
                onClick={() => {
                  setModelOpen(true);
                  setModelPersonaId(icon);
                }}
                unoptimized
              />
            ))}
          </div>
        </div>
        <div className="w-[1px] h-full mx-6 bg-white/30"></div>
        <div className="flex flex-col justify-center gap-3 text-white">
          {personaName && (
            <div className="flex gap-4">
              <p className="text-2xl">{personaName}</p>
              <p className="text-2xl opacity-30">智能體</p>
            </div>
          )}
          {personaIntro && <p className="text-xs">{personaIntro}</p>}
        </div>
      </div>
      {modelOpen && (
        <div
          onClick={() => setModelOpen(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white flex flex-col rounded-lg max-w-md w-full max-h-[90vh] my-auto"
          >
            <div className="relative flex-shrink-0">
              <Image
                src={personaIconMap[modelPersonaId]}
                alt="persona"
                width={1000}
                height={1000}
                className="w-full rounded-t-lg object-cover max-h-[45vh]"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-4 px-4 py-8 overflow-y-auto">
              <h3 className="text-2xl font-bold">
                {
                  personas.find((persona) => persona._id === modelPersonaId)
                    ?.persona_name
                }
              </h3>
              <p className="text-base leading-relaxed">
                {isStreaming
                  ? `等等，它還沒說完！請等待當前對話結束後再切換智能體。`
                  : personas.find((persona) => persona._id === modelPersonaId)
                      ?.intro}
              </p>
              <button
                className="w-1/2 mx-auto bg-black text-white font-bold h-[42px] rounded-lg"
                onClick={() => {
                  if (isStreaming) {
                    setModelOpen(false);
                  } else {
                    setModelOpen(false);
                    setPersonaId(modelPersonaId);
                  }
                }}
              >
                {isStreaming ? `我知道了` : `看看我推薦你讀什麼書`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonaSelector;
