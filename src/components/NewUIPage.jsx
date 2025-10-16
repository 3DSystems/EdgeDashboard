/**
 * NewUIPage.jsx
 * Renders compact cards using renamed props:
 * printerName, printerState, jobName, progress, timeRemaining, material, startTime, endTime
 */
import React, { useMemo, useState } from "react";
import PrinterSimpleCard from "./PrinterSimpleCard";
import { filterType, printerModelMap, printerStateType } from "../utils/common"; // same path you used in App.jsx
import DropDown from "./DropDown/DropDown";
import "./NewUIPage.css"
import { HLSCameraStream } from "./HLSCameraStream/HLSCameraStream";
import PrinterFeedModal from "./PrinterFeedModal/PrinterFeedModal";


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

const GridIcon = () => {
  return (
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clip-rule="evenodd"/>
    </svg>
  )
}

const ListIcon = () => {
  return (
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"/>
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
  const [selectedView, setSelectedView] = React.useState("card")
  const [printerFeed, setPrinterFeed] = useState(null)
  const [printerName, setPrinterName] = useState("")

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

  const viewUpdateHandler = () => {
    setSelectedView(prev => prev === "card" ? "list" : "card");
  }

  const [play, setPlay] = useState(false)

  const showLiveFeed = async (type) => {
    const streamType = type.toLowerCase().indexOf("sla") != -1 ? "sla750" : "cuda"
    const res = await fetch("http://localhost:8000/add-cam", {
      method: "POST",
      body: JSON.stringify({
        url: `rtsp://192.168.230.172:8554/${streamType}` 
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()


    setTimeout(() => {
      setPrinterFeed(data.data.url)
      setPrinterName(type)
    }, 1000)
  }

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
            <div class="view-type-container">
              <div className={`view-svg-container `} onClick={viewUpdateHandler}>
                {selectedView === "card" ? <ListIcon /> : <GridIcon />}
              </div>
              {/* <div className={`view-svg-container ${selectedView === "card" ? 'active-type' : ''}`} onClick={() => setSelectedView("card")}>
                <GridIcon />
              </div> */}
            </div>
            <DropDown options={["SLA", "MJP", "DDP"]} />
          {/* <div class="filter-search">
            <input type="text" placeholder="Search by Technology" />
          </div> */}
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
            display: selectedView === "list" ? "grid" : "flex",
            // display: "flex",
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
                  viewMode={selectedView}
                  key={id}
                  printerName={data.printerName}
                  printerState={data.printerState}
                  jobName={data.jobName}
                  progress={data.progress}
                  timeRemaining={data.timeRemaining}
                  material={data.material}
                  startTime={data.startTime}
                  endTime={data.endTime}
                  onShowFeed={showLiveFeed}
                />
              );
            })}
        </div>
      </div>
      {!!printerFeed && <PrinterFeedModal onClose={() => setPrinterFeed(null)} printerName={printerName} url={`http://localhost:8000/hls/${printerFeed}`}/>}
    </main>
  );
}
