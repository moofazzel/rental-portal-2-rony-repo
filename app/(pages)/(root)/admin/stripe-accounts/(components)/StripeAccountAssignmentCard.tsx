"use client";

import {
  linkPropertiesToAccountAction,
  unlinkPropertiesFromAccountAction,
} from "@/app/actions/stripe-accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { IPropertyFull } from "@/types/properties.type";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteStripeAccountModal from "./DeleteStripeAccountModal";

export interface StripeAccount {
  id: string;
  name: string;
  accountId: string;
  status: "active" | "pending" | "restricted";
  businessName?: string;
  businessEmail?: string;
  description?: string;
  isGlobalAccount?: boolean;
}

interface StripeAccountAssignmentCardProps {
  account: StripeAccount;
  properties: IPropertyFull[];
}

export default function StripeAccountAssignmentCard({
  account,
  properties,
}: StripeAccountAssignmentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDefaultWarning, setShowDefaultWarning] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const handleDefaultToggle = (checked: boolean) => {
    if (checked) {
      setShowDefaultWarning(true);
    } else {
      setIsDefault(false);
    }
  };

  // For now, just show basic account info without assignment logic
  const assignedProperties = properties.filter(
    (property) => property.stripeAccount?._id === account.id
  );

  const handlePropertyToggle = async (propertyId: string, checked: boolean) => {
    try {
      if (checked) {
        // Link property to account
        const result = await linkPropertiesToAccountAction(account.id, [
          propertyId,
        ]);
        if (result.success) {
          toast.success("Property assigned successfully!");
        } else {
          toast.error(result.error || "Failed to assign property");
        }
      } else {
        // Unlink property from account
        const result = await unlinkPropertiesFromAccountAction(account.id, [
          propertyId,
        ]);
        if (result.success) {
          toast.success("Property unassigned successfully!");
        } else {
          toast.error(result.error || "Failed to unassign property");
        }
      }
    } catch (error) {
      console.error("Error toggling property assignment:", error);
      toast.error("An error occurred while updating property assignment");
    }
  };

  const handleSelectAll = async (checked: boolean) => {
    try {
      const propertyIds = properties
        .map((property) => property.id || property._id || "")
        .filter((id) => id);

      if (checked) {
        // Link all properties to account
        const result = await linkPropertiesToAccountAction(
          account.id,
          propertyIds
        );
        if (result.success) {
          toast.success("All properties assigned successfully!");
        } else {
          toast.error(result.error || "Failed to assign properties");
        }
      } else {
        // Unlink all properties from account
        const result = await unlinkPropertiesFromAccountAction(
          account.id,
          propertyIds
        );
        if (result.success) {
          toast.success("All properties unassigned successfully!");
        } else {
          toast.error(result.error || "Failed to unassign properties");
        }
      }
    } catch (error) {
      console.error("Error bulk updating property assignments:", error);
      toast.error("An error occurred while updating property assignments");
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{account.name}</div>
              <div className="text-xs text-gray-500">
                {account.accountId
                  ? `${account.accountId.slice(-8)}...`
                  : "No Account ID"}
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            {expanded && (
              <DeleteStripeAccountModal
                accountId={account.id}
                accountName={account.name}
              />
            )}
            <Badge
              variant={account.status === "active" ? "default" : "secondary"}
              className="text-xs"
            >
              {account.status}
            </Badge>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600">Default</span>
                <Switch
                  checked={isDefault}
                  onCheckedChange={handleDefaultToggle}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Hide" : "Manage Properties"}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Account Details */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-gray-600 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Account Details</p>
                <p className="text-xs">
                  Business: {account.businessName || "Not specified"}
                  {account.businessEmail && (
                    <>
                      <br />
                      Email: {account.businessEmail}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Property Assignment Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Property Assignments</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                {assignedProperties.length} assigned
              </div>
            </div>

            {/* Select All Option */}
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <Checkbox
                id={`select-all-${account.id}`}
                checked={false}
                onCheckedChange={handleSelectAll}
                disabled={properties.length === 0}
              />
              <label
                htmlFor={`select-all-${account.id}`}
                className={`text-sm font-medium ${
                  properties.length === 0 ? "text-gray-400" : "text-blue-900"
                }`}
              >
                Select all properties ({properties.length})
              </label>
            </div>

            {/* Properties List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {properties.map((property) => {
                const isAssigned = property.stripeAccount?._id === account.id;
                const isUsingDefault = !property.stripeAccount;

                return (
                  <div
                    key={property.id || property._id}
                    className="flex items-center space-x-3 p-2 rounded-lg border"
                  >
                    <Checkbox
                      id={`property-${property.id || property._id}`}
                      checked={isAssigned}
                      onCheckedChange={(checked) =>
                        handlePropertyToggle(
                          property.id || property._id || "",
                          checked as boolean
                        )
                      }
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`property-${property.id || property._id}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {property.name}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {property.address?.city}, {property.address?.state}
                        </span>
                        {isUsingDefault && (
                          <Badge variant="outline" className="text-xs">
                            Using Default
                          </Badge>
                        )}
                        {isAssigned && (
                          <Badge variant="default" className="text-xs">
                            Assigned
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-green-600" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">
                    {assignedProperties.length} properties assigned to this
                    account
                  </p>
                  <p className="text-xs">
                    {properties.length - assignedProperties.length} properties
                    using default account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      {/* Default Account Warning Dialog */}
      {showDefaultWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Set as Default Account?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  All properties you add in the future will automatically use
                  this account for payments unless specifically assigned to
                  another account.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDefaultWarning(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsDefault(true);
                      setShowDefaultWarning(false);
                    }}
                  >
                    Set as Default
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
