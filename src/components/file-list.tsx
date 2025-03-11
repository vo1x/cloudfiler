"use client";

import {
  getEpisodeNumber,
  getHumanReadableFileSize,
  getSearchTerm,
} from "@/lib/parser";
import { useMimeStore } from "@/stores/mimeStore";
import type { MimeData } from "@/types/mime";
import { Link } from "lucide-react";
import { Tag } from "./ui/tag";
import {
  Folder,
  HardDrive,
  Hash,
  Archive,
  Video,
  FileVideo,
  SquareArrowOutUpRight,
} from "lucide-react";

import { CopyButton } from "./ui/button";

export const FileList: React.FC = () => {
  const mime = useMimeStore((state) => state.mime);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="rounded-lg p-2 w-full flex flex-col gap-4 overflow-y-auto h-full max-h-[calc(100vh-200px)] ">
        {mime.files?.map((file: MimeData) => (
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
  const { name, id, webContentLink, size, mimeType } = file;

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
    <div className="bg-neutral-900 rounded-md border border-neutral-800 p-4 transition-colors duration-200 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-col gap-1 font-semibold text-white w-full">
          <div className="gap-4 flex items-center justify-between">
            <span>{name}</span>
            <a
              href={`https://uhdmovies.fyi/search/${getSearchTerm(file.name)}`}
              className=" right-0 pr-4 cursor-pointer text-neutral-400 transition-colors duration-150 hover:text-inherit"
              target="_blank"
            >
              <SquareArrowOutUpRight></SquareArrowOutUpRight>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {mimeType === "folder" && <Tag tag={id} icon={HardDrive} />}

            <Tag tag={getHumanReadableFileSize(size)} icon={HardDrive} />

            <Tag
              tag={
                getEpisodeNumber(name)
                  ? `Episode ${getEpisodeNumber(name)}`
                  : null
              }
              icon={Hash}
            />

            <Tag
              tag={mimeType}
              icon={
                archiveMimeTypes.includes(mimeType)
                  ? Archive
                  : mimeType === "folder"
                  ? Folder
                  : FileVideo
              }
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start gap-2 text-sm text-neutral-400 mt-4 border-t border-neutral-800 pt-2">
        <span className="text-xs">Click corresponding buttons to copy</span>

        <div className="flex justify-start gap-4">
          <CopyButton
            item={`Web Link`}
            icon={Link}
            content={webContentLink || ""}
          />

          {mimeType !== "folder" && (
            <>
              <CopyButton
                item={`Episode Code`}
                icon={Hash}
                content={seriesString || ""}
              />

              <CopyButton
                item={`Movie Code`}
                icon={Video}
                content={movieString || ""}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
