

import { Fragment, useState } from "react";
import { Link } from "@tanstack/react-router";
import Head from "@rexolute/ui/head";

const Page = () => {
  const [activeTab, setActiveTab] = useState("reassigned");

  return (
    <Fragment>
      <Head title="Therapist Details" />
      <div className="flex min-h-screen w-full flex-col px-6 py-4">
        {/* Page content */}
        <h1>Therapist</h1>
      </div>
    </Fragment>
  );
};


export default Page;
