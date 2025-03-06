import { Navbar } from "@/components/navbar";
import { Searchbar } from "@/components/search-bar";
import { MimeMeta } from "@/components/mime-metadata";
import { FileList } from "@/components/file-list";
import { EmbedCode } from "@/components/embed-code";

import { auth } from "@/auth";

export default async function GamesFiler() {
  const session = await auth();

  return (
    <div className="h-screen flex flex-col items-center gap-6">
      <Navbar />
      {!session?.user && (
        <div className="text-white flex h-full text-3xl items-center justify-center">
          Log In to use the site.
        </div>
      )}

      <div className="flex w-full max-w-7xl gap-6 ">
        <div className="flex flex-col items-center gap-4">
          <EmbedCode codeType="movie" />
          <EmbedCode codeType="series" />
        </div>

        <FileList />
      </div>
    </div>
  );
}
