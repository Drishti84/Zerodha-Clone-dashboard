import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import AnalyticsWindow from "./AnalyticsWindow";
import FundamentalsWindow from "./FundamentalsWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, price) => {},
  closeSellWindow: () => {},
  openAnalyticsWindow: (uid) => {},
  closeAnalyticsWindow: () => {},
  openFundamentalsWindow: (uid) => {},
  closeFundamentalsWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);

  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellStock, setSelectedSellStock] = useState({ uid: "", price: 0 });

  const [isAnalyticsWindowOpen, setIsAnalyticsWindowOpen] = useState(false);
  const [analyticsUID, setAnalyticsUID] = useState("");

  const [isFundamentalsWindowOpen, setIsFundamentalsWindowOpen] = useState(false);
  const [fundamentalsUID, setFundamentalsUID] = useState("");

  const handleOpenBuyWindow = (uid, price) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  const handleOpenSellWindow = (uid, price) => {
    setIsSellWindowOpen(true);
    setSelectedSellStock({ uid, price });
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedSellStock({ uid: "", price: 0 });
  };

  const handleOpenAnalyticsWindow = (uid) => {
    setIsAnalyticsWindowOpen(true);
    setAnalyticsUID(uid);
  };

  const handleCloseAnalyticsWindow = () => {
    setIsAnalyticsWindowOpen(false);
    setAnalyticsUID("");
  };

  const handleOpenFundamentalsWindow = (uid) => {
    setIsFundamentalsWindowOpen(true);
    setFundamentalsUID(uid);
  };

  const handleCloseFundamentalsWindow = () => {
    setIsFundamentalsWindowOpen(false);
    setFundamentalsUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        openAnalyticsWindow: handleOpenAnalyticsWindow,
        closeAnalyticsWindow: handleCloseAnalyticsWindow,
        openFundamentalsWindow: handleOpenFundamentalsWindow,
        closeFundamentalsWindow: handleCloseFundamentalsWindow,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow uid={selectedStockUID} currentPrice={selectedStockPrice} />
      )}
      {isSellWindowOpen && (
        <SellActionWindow uid={selectedSellStock.uid} currentPrice={selectedSellStock.price} />
      )}
      {isAnalyticsWindowOpen && (
        <AnalyticsWindow uid={analyticsUID} />
      )}
      {isFundamentalsWindowOpen && (
        <FundamentalsWindow uid={fundamentalsUID} />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
