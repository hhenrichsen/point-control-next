"use client";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
  Textarea,
  Input,
} from "@pointcontrol/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateGame } from "@pointcontrol/types";
import { createGameSchema } from "@pointcontrol/types";
import { useRouter } from "next/navigation";
import { trpcClient } from "../../util/trpc";

export default function CreateGameForm(): JSX.Element {
  const form = useForm<CreateGame>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      public: true,
      approval: false,
    },
  });

  const router = useRouter();

  async function onSubmit(values: CreateGame): Promise<void> {
    try {
      await trpcClient.createGame.mutate(values).then(({ slug }) => {
        router.push(`/games/${slug}`);
      });
    } catch (e: unknown) {
      // TODO: Figure out why this isn't displaying.
      if (e instanceof Error) {
        form.setError("root", { type: "custom", message: e.message });
        return;
      }
      form.setError("root", { type: "custom", message: "Unknown error" });
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Title</FormLabel>
                <FormDescription>
                  The name this game should be known by
                </FormDescription>
              </div>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Description</FormLabel>
                <FormDescription>A little bit about the game</FormDescription>
              </div>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Location</FormLabel>
                <FormDescription>Where this game happens</FormDescription>
              </div>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="approval"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Require Approval</FormLabel>
                <FormDescription>
                  If users can join the game without manual admin approval
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="public"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Public</FormLabel>
                <FormDescription>
                  If this game should show up in public game listings
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
}
