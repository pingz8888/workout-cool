import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Play } from "lucide-react";
import { ExerciseAttributeNameEnum } from "@prisma/client";

import { useCurrentLocale, useI18n } from "locales/client";
import { getExerciseAttributesValueOf } from "@/entities/exercise/shared/muscles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYouTubeThumbnail } from "../hooks/use-youtube-thumbnail";

import { ExerciseVideoModal } from "./exercise-video-modal";

import type { ExerciseWithAttributes } from "../types";

interface ExercisePickModalProps {
  exercise: ExerciseWithAttributes | null;
  muscle: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPick: () => void;
}

export function ExercisePickModal({ exercise, muscle, isOpen, onClose, onConfirmPick }: ExercisePickModalProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const { src: thumbnailSrc, handleError: handleImageError, isUnavailable } = useYouTubeThumbnail(exercise?.fullVideoImageUrl);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener("close", handleClose);
    return () => modal.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!exercise) return null;

  const exerciseName = locale === "fr" ? exercise.name : exercise.nameEn || exercise.name;
  const exerciseDescription = locale === "fr" ? exercise.description : exercise.descriptionEn || exercise.description;
  const exerciseIntroduction = locale === "fr" ? exercise.introduction : exercise.introductionEn || exercise.introduction;

  // Extraire les attributs utiles
  const equipmentAttributes = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.EQUIPMENT);
  const typeAttributes = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.TYPE);
  const mechanicsTypeValue = getExerciseAttributesValueOf(exercise, ExerciseAttributeNameEnum.MECHANICS_TYPE);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    onConfirmPick();
    onClose();
  };

  const handleWatchVideo = () => {
    setShowVideo(true);
  };

  return (
    <>
      <dialog className="modal modal-bottom sm:modal-middle" ref={modalRef}>
        <div className="modal-box max-w-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{exerciseName}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" variant="outline">
                  {t(`workout_builder.muscles.${muscle.toLowerCase()}` as keyof typeof t)}
                </Badge>
                {mechanicsTypeValue && (
                  <Badge className="text-xs" variant="outline">
                    {mechanicsTypeValue.map((value) => value.replace("_", " "))}
                  </Badge>
                )}
              </div>
            </div>
            <form method="dialog">
              <Button className="p-1" size="small" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Image/Video Thumbnail */}
          {thumbnailSrc && !isUnavailable ? (
            <div
              className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden mb-4 cursor-pointer"
              onClick={handleWatchVideo}
            >
              <Image
                alt={exerciseName || "Exercise"}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={thumbnailSrc}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button className="bg-white/90 text-slate-900" size="small" variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  {t("workout_builder.exercise.watch_video")}
                </Button>
              </div>
            </div>
          ) : exercise.fullVideoUrl ? (
            <div className="mb-4">
              <Button className="w-full" onClick={handleWatchVideo} size="small" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                {t("workout_builder.exercise.watch_video")}
              </Button>
            </div>
          ) : null}

          {/* Introduction */}
          {exerciseIntroduction && (
            <div className="mb-4">
              <div
                className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: exerciseIntroduction }}
              />
            </div>
          )}

          {/* Description */}
          {exerciseDescription && (
            <div className="mb-4">
              <div
                className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: exerciseDescription }}
              />
            </div>
          )}

          {/* Attributes */}
          <div className="space-y-3 mb-6">
            {/* Equipment */}
            {equipmentAttributes.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">Equipment</h4>
                <div className="flex flex-wrap gap-1">
                  {equipmentAttributes.map((equipment, index) => (
                    <Badge className="text-xs" key={index} variant="outline">
                      {equipment.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Types */}
            {typeAttributes.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">Exercise Types</h4>
                <div className="flex flex-wrap gap-1">
                  {typeAttributes.map((type, index) => (
                    <Badge
                      className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                      key={index}
                      variant="default"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
            <form className="flex gap-2" method="dialog">
              <Button size="small" variant="outline">
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirm} size="small">
                ⭐ {t("workout_builder.exercise.pick")}
              </Button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Video Modal */}
      <ExerciseVideoModal exercise={exercise} onOpenChange={setShowVideo} open={showVideo} />
    </>
  );
}
