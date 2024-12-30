import React from "react";

function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>
        <div>Navigation</div>
        <div>{children}</div>
      </div>
      <div>Sidebar</div>
    </div>
  );
}

export default CheckoutLayout;
