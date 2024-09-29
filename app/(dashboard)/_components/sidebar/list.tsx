"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./item";

export function List() {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (userMemberships.data?.length === 0) return null;

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((membership) => {
        return (
          <div className="bg-white rounded-sm">
            <Item
              id={membership.organization.id}
              key={membership.organization.id}
              imageUrl={membership.organization.imageUrl}
              title={membership.organization.name}
            />
          </div>
        );
      })}
    </ul>
  );
}