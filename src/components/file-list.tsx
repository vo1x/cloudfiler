"use client";

import {
  getEpisodeNumber,
  getHumanReadableFileSize,
  getSearchTerm,
} from "@/lib/parser";
import { useMimeStore } from "@/stores/mimeStore";
import type { MimeData } from "@/types/mime";
import { Link } from "lucide-react";
import {
  FileIcon,
  LinkIcon,
  InfoIcon,
  Folder,
  HardDrive,
  Hash,
  Archive,
  Video,
  FileVideo,
  Link2,
  SquareArrowOutUpRight,
  ClipboardCopy,
  ClipboardCheck,
  Info,
} from "lucide-react";
import { useState } from "react";

export const FileList: React.FC = () => {
  const mime = useMimeStore((state) => state.mime);

  if (!mime.files) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="rounded-lg p-2 w-full flex flex-col gap-4 overflow-y-auto h-full max-h-[calc(100vh-200px)] ">
        {mime.files.map((file: MimeData) => (
          <File key={file.id} file={file} />
        ))}
        {mime?.subFolders?.map((folder: MimeData) => (
          <File key={folder.id} file={folder} />
        ))}
      </div>
    </div>
  );
};

const File: React.FC<{ file: MimeData }> = ({ file }) => {
  const { name, id, webContentLink, size, mimeType, type } = file;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const archiveMimeTypes = [
    "application/zip", // ZIP
    "application/x-rar-compressed", // RAR
    "application/x-7z-compressed", // 7z
    "application/gzip", // GZIP
    "application/x-tar", // TAR
    "application/x-bzip2", // BZ2
    "application/x-xz", // XZ
    "application/x-iso9660-image", // ISO
    "application/vnd.android.package-archive", // APK
  ];

  const seriesString = `[maxbutton id="2" text="Episode ${getEpisodeNumber(
    name
  )}" url="${webContentLink}"]`;

  const movieString = `
                      <p style="text-align: center;">[mks_separator style="solid" height="5"]</p>
                      <p style="text-align: center;"><strong><span style="color: #000000;">${name.replace(
                        ".mkv",
                        ""
                      )}</span>
                      <span style="color: #000000;">[</span><span style="color: #ff0000;">${getHumanReadableFileSize(
                        size
                      )}</span><span style="color: #000000;">]</span></strong></p>
                      <p style="text-align: center;">[maxbutton id="1" url="${webContentLink}" ]</p>
                      <p style="text-align: center;">[mks_separator style="solid" height="5"]</p>
                    `;

  return (
    <div className="bg-neutral-900 rounded-md border border-neutral-800 p-4  transition-colors duration-200 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-col gap-1 font-semibold text-white w-full">
          <div className="gap-4 flex items-center justify-between">
            <span>{name}</span>
            <a
              href={`https://uhdmovies.fyi/search/${getSearchTerm(file.name)}`}
              className=" right-0 pr-4 cursor-pointer"
              target="_blank"
            >
              <SquareArrowOutUpRight></SquareArrowOutUpRight>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {mimeType === "folder" && (
              <span className="bg-neutral-800 gap-2 border border-neutral-700 p-1 px-2 rounded-2xl text-xs text-neutral-300 flex items-center w-max">
                <span>{id}</span>
              </span>
            )}

            {!(mimeType === "folder") && (
              <div className="flex items-center gap-2">
                {size && (
                  <span className="bg-neutral-800 gap-2 border border-neutral-700 p-1 px-2 rounded-2xl text-xs text-neutral-300 flex items-center w-max">
                    <HardDrive size={18}></HardDrive>
                    <span>{getHumanReadableFileSize(size)}</span>
                  </span>
                )}

                {getEpisodeNumber(name) && (
                  <span className="bg-neutral-800 gap-2 border border-neutral-700 p-1 px-2 rounded-2xl text-xs text-neutral-300 flex items-center w-max">
                    <Hash size={18}></Hash>
                    {getEpisodeNumber(name) ? (
                      <span>{`Episode ${getEpisodeNumber(name)}`}</span>
                    ) : null}
                  </span>
                )}
              </div>
            )}
            {mimeType && (
              <span className="bg-neutral-800 gap-2 border border-neutral-700 p-1 px-2 rounded-2xl text-xs text-neutral-300 flex items-center w-max">
                {archiveMimeTypes.includes(mimeType) ? (
                  <Archive size={18}></Archive>
                ) : mimeType === "folder" ? (
                  <Folder size={18} />
                ) : (
                  <FileVideo size={18}></FileVideo>
                )}
                <span>{mimeType}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start gap-2 text-sm text-neutral-400 mt-4 border-t border-neutral-800 pt-2">
        <span className="text-xs">Click corresponding buttons to copy</span>

        <div className="flex justify-start gap-4">
          <div
            className=" flex items-center gap-1 hover:text-blue-400 cursor-pointer w-max border border-neutral-700 bg-neutral-800 p-2 rounded-md"
            onClick={() => copyToClipboard(webContentLink || "")}
          >
            <Link className="w-5 h-5" />
            <span title={webContentLink || ""}>Web Link</span>
          </div>

          {mimeType !== "folder" && (
            <div className="flex items-center gap-4">
              <div
                className=" flex items-center gap-1 hover:text-blue-400 cursor-pointer w-max border border-neutral-700 bg-neutral-800 p-2 rounded-md"
                onClick={() => copyToClipboard(seriesString || "")}
              >
                <Hash className="w-5 h-5" />
                <span title={seriesString || ""}>Episode Code</span>
              </div>
              <div
                className=" flex items-center gap-1 hover:text-blue-400 cursor-pointer w-max border border-neutral-700 bg-neutral-800 p-2 rounded-md"
                onClick={() => copyToClipboard(movieString || "")}
              >
                <Video className="w-5 h-5" />
                <span title={movieString || ""}>Movie Code</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
