import { Card } from "@/components/ui/card";
import { exa } from "@agentic/exa";

export function Sources({ result }: { result: exa.SearchResponse }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {result.results.map((source) => {
        return (
          <a target="_blank" href={source.url} key={source.id}>
            <Card className="p-4 hover:bg-secondary w-full overflow-hidden h-20 flex items-center">
              <div className="font-thin text-sm text-secondary-foreground text-ellipsis line-clamp-3">
                {source.title}
              </div>
            </Card>
          </a>
        );
      })}
    </div>
  );
}
