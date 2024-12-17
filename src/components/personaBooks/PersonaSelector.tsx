"use client";
import React from "react";
import Image from "next/image";
import { usePersonaStore } from "@/store/usePersonaStore";
import { personaIconMap } from "@/constants/personaMapping";

const PersonaSelector = () => {
  const { personaId, personas, setPersonaId } = usePersonaStore();
  const personaName = personas.find(
    (persona) => persona._id === personaId
  )?.persona_name;

  const personaIntro = personas.find(
    (persona) => persona._id === personaId
  )?.intro;
  return (
    <div className="h-fit p-4 bg-black rounded-lg items-center flex w-full">
      <div className="flex justify-between flex-shrink-0 items-center">
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(personaIconMap).map((icon) => (
            <Image
              key={icon}
              src={personaIconMap[icon]}
              alt="personaIconMap"
              className={`rounded-full cursor-pointer ${
                personaId === icon ? "" : "opacity-30"
              }`}
              width={40}
              height={40}
              onClick={() => {
                setPersonaId(icon);
              }}
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
  );
};

export default PersonaSelector;
