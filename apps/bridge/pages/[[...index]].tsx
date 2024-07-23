import { AnimatePresence } from "framer-motion";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import {
  bridgeControllerGetAcrossDomains,
  bridgeControllerGetCctpDomains,
  bridgeControllerGetDeployments,
  bridgeControllerGetDeploymentsByDomain,
  bridgeControllerGetHyperlaneMailboxes,
  bridgeControllerGetSuperbridgeConfig,
} from "@/codegen";
import { Layout } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Providers } from "@/components/Providers";
import { Bridge } from "@/components/bridge";
import { StatefulHead } from "@/components/head";
import { isRenzo, isSuperbridge } from "@/config/app";
import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";
import { useInitialInjectedState } from "@/hooks/use-initial-injected-state";
import { InjectedStoreProvider } from "@/state/injected";
import { ThemeProvider } from "@/state/theme";

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const ignored = ["favicon", "locales", "_vercel", "_next"];
  if (
    !req.url ||
    !req.headers.host ||
    ignored.find((x) => req.url?.includes(x))
  ) {
    return { props: { deployments: [] } };
  }

  if (isSuperbridge) {
    const [name] = req.url.split(/[?\/]/).filter(Boolean);

    let testnets = false;
    if (
      req.headers.host === "testnets.superbridge.app" ||
      SUPERCHAIN_TESTNETS.includes(name)
    ) {
      testnets = true;
    }

    const [{ data }, cctpDomains, acrossDomains, superbridgeConfig] =
      await Promise.all([
        bridgeControllerGetDeployments({
          names: [...SUPERCHAIN_MAINNETS, ...SUPERCHAIN_TESTNETS],
        }),
        bridgeControllerGetCctpDomains(),
        bridgeControllerGetAcrossDomains(),
        bridgeControllerGetSuperbridgeConfig(),
      ]);

    return {
      props: {
        deployments: data,
        acrossDomains: acrossDomains.data,
        cctpDomains: cctpDomains.data,
        testnets,
        superbridgeConfig: superbridgeConfig.data,
      },
    };
  }

  if (isRenzo) {
    const [hyperlaneMailboxes] = await Promise.all([
      bridgeControllerGetHyperlaneMailboxes(),
    ]);

    return {
      props: {
        hyperlaneMailboxes: hyperlaneMailboxes.data,
      },
    };
  }

  if (
    req.headers.host?.includes("localhost") ||
    req.headers.host?.includes("ngrok")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: ["op-sepolia"],
    });
    return { props: { deployments: data } };
  }

  // these need to go last so they don't clash with devnets. or testnets. subdomains
  const [id] = req.headers.host?.split(".");

  // [id].devnets.superbridge|rollbridge.app
  // [id].test.devnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("devnets.superbridge.app") ||
    req.headers.host.includes("devnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  // [id].testnets.superbridge|rollbridge.app
  // [id].test.testnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("testnets.superbridge.app") ||
    req.headers.host.includes("testnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  // [id].mainnets.superbridge|rollbridge.app
  // [id].test.mainnets.superbridge|rollbridge.app
  if (
    req.headers.host.includes("mainnets.superbridge.app") ||
    req.headers.host.includes("mainnets.rollbridge.app")
  ) {
    const { data } = await bridgeControllerGetDeployments({
      names: [id],
    });
    return { props: { deployments: data } };
  }

  const { data } = await bridgeControllerGetDeploymentsByDomain(
    req.headers.host
  );

  return { props: { deployments: data } };
};

export default function IndexRoot(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const initialValues = useInitialInjectedState(props);

  return (
    <InjectedStoreProvider initialValues={initialValues}>
      <ThemeProvider>
        <Providers>
          <StatefulHead />
          <Layout>
            <Index />
          </Layout>
        </Providers>
      </ThemeProvider>
    </InjectedStoreProvider>
  );
}

function Index() {
  return (
    <PageTransition key={"index"}>
      <AnimatePresence mode="sync">
        <PageTransition key={"bridge"}>
          <Bridge key={"bridge"} />
        </PageTransition>
      </AnimatePresence>
    </PageTransition>
  );
}
