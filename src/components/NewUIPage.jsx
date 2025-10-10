/**
 * NewUIPage.jsx
 * Renders compact cards using renamed props:
 * printerName, printerState, jobName, progress, timeRemaining, material, startTime, endTime
 */
import React, { useMemo } from "react";
import PrinterSimpleCard from "./PrinterSimpleCard";
import { filterType, printerModelMap, printerStateType } from "../utils/common"; // same path you used in App.jsx


const PlayIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Icons-16px / Play">
        <path id="Triangle" d="M17.2692 9.13622C17.9307 9.5221 17.9307 10.4779 17.2692 10.8638L5.25387 17.8727C4.58722 18.2616 3.75 17.7808 3.75 17.009L3.75 2.99104C3.75 2.21925 4.58721 1.73838 5.25387 2.12726L17.2692 9.13622Z" fill="white"/>
      </g>
    </svg>

  )
}

const Hourglass = () => {
  return (
    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" id="hourglass">
      <path d="M26 10.652V2h.986C27.546 2 28 1.552 28 1s-.454-1-1.014-1H7.014C6.454 0 6 .448 6 1s.454 1 1.014 1H8v8.652c0 .57.244 1.114.67 1.494L12.994 16 8.67 19.854c-.426.38-.67.924-.67 1.494V30h-.986C6.454 30 6 30.448 6 31s.454 1 1.014 1h19.974c.558 0 1.012-.448 1.012-1s-.454-1-1.014-1H26v-8.652c0-.57-.244-1.114-.67-1.494L21.006 16l4.324-3.854c.426-.38.67-.924.67-1.494zm-2 0L18 16l6 5.348V30H10v-8.652L16 16l-6-5.348V2h14v8.652zm-2-2.896V6H12v1.756l5 4.456zM12 24.252V28h10v-3.748L19.474 22h-4.948z"></path>
    </svg>

  )
}

const CorrectIcon = () => {
  return (
    <div class="svg-container">
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        role="img"
        aria-label="Correct"
        style={{height: 'auto', width: '100%'}}
      >
        <title>Correct</title>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.6-6 1.4 1.2-7 7z"/>
      </svg>
    </div>
  )
}

export default function NewUIPage({ printers = [] }) {
  const [selectedChip, setSelectedChip] = React.useState(0)

  const getChipSelectHandler = (value) => {
    return () => setSelectedChip(value)
  }



  const filteredPrinters = useMemo(() => {
    switch(selectedChip) {
      case filterType.idle: {
        return printers?.filter(p => p.printerState === printerStateType.idle)
      }
      case filterType.printing: {
        return printers?.filter(p => p.printerState === printerStateType.printing)
      }
      case filterType.completed: {
        return printers?.filter(p => p.printerState === printerStateType.completed)
      }
      case filterType.aborted: {
        return printers?.filter(p => p.printerState === printerStateType.aborted)
      }
      default: {
        return printers
      }

    }
  }, [selectedChip, printers])
  
  return (
    <main
      style={{ minHeight: "100vh", 
      // background: "#111827", 
        background: "#1e1e1e", 
        color: "#e5e7eb" ,
        paddingTop: '8px'
      }}
    >
      <div 
        // style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}
        style={{ 
          margin: "0 auto", 
          padding: "0px 16px 24px" 
          }}
      >
        <div class="header-container">
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <img
                src={"/icons/ddd-logo.svg"}
                alt="Printer Logo"
                style={{
                  width: "20px",
                  height: "20px",
                  objectFit: "contain",
                  filter: "invert(1)",
                }}
              />
            </div>
            <h1 style={{ 
              // marginBottom: 16, 
              margin: 0,
              fontSize: 18, 
              fontWeight: 700 
            }}>
              Printer Dashboard
            </h1>
        </div>

        <div class="filter-container">
          <div class="filter-search">
            <input type="text" placeholder="Search by Technology" />
          </div>
          <div className="separator"></div>
          <div 
            onClick={getChipSelectHandler(filterType.all)} 
            class={`filter-chip filter-chip-all ${selectedChip === filterType.all ? 'filter-chip-active' : ''}`}>
            All
          </div>
          <div 
            onClick={getChipSelectHandler(filterType.idle)} 
            class={`filter-chip filter-chip-idle ${selectedChip === filterType.idle ? 'filter-chip-active' : ''}`}>
            <Hourglass />
            Idle
          </div>
          <div 
            onClick={getChipSelectHandler(filterType.printing)} 
            class={`filter-chip filter-chip-printing ${selectedChip === filterType.printing ? 'filter-chip-active' : ''}`}>
            <PlayIcon />
            Printing
          </div>
          <div 
            onClick={getChipSelectHandler(filterType.completed)} 
            class={`filter-chip filter-chip-completed ${selectedChip === filterType.completed ? 'filter-chip-active' : ''}`}>
            <CorrectIcon />
            Completed
          </div>
          <div 
            onClick={getChipSelectHandler(filterType.aborted)} 
            class={`filter-chip filter-chip-aborted ${selectedChip === filterType.aborted ? 'filter-chip-active' : ''}`}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <img
                src={"/icons/x.svg"}
                alt="Printer Logo"
                style={{
                  width: "18px",
                  height: "18px",
                  objectFit: "contain",
                  filter: "invert(1)",
                }}
              />
            </div>
            Aborted
          </div>
        </div>

        <div
          style={{
            // display: "grid",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            // justifyContent: "space-between"
            // gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          }}
        >
          {filteredPrinters
            .filter((p) => {
              const match = p.deviceStreamName?.match(/asset_(\d+)-/);
              return match?.[1] !== printerModelMap.EdgePC;
            })
            .map((data) => {
              const id = data.deviceStreamName;
              return (
                <PrinterSimpleCard
                  key={id}
                  printerName={data.printerName}
                  printerState={data.printerState}
                  jobName={data.jobName}
                  progress={data.progress}
                  timeRemaining={data.timeRemaining}
                  material={data.material}
                  startTime={data.startTime}
                  endTime={data.endTime}
                />
              );
            })}
        </div>
      </div>
    </main>
  );
}
