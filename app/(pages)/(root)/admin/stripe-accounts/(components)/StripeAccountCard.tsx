"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IPropertyFull } from "@/types/properties.type";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Settings,
  Shield,
  Unlink,
  Zap,
} from "lucide-react";

interface StripeAccountCardProps {
  property: IPropertyFull;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleGlobalAccount: (useGlobal: boolean) => void;
  globalStripeEnabled: boolean;
}

export default function StripeAccountCard({
  property,
  onConnect,
  onDisconnect,
  onToggleGlobalAccount,
  globalStripeEnabled,
}: StripeAccountCardProps) {
  const hasStripeAccount = property.hasStripeAccount && property.stripeAccount;
  const isVerified = property.stripeAccount?.isVerified;
  const isGlobalAccount = property.stripeAccount?.isGlobalAccount;

  const getStatusIcon = () => {
    if (!hasStripeAccount)
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
    if (!isVerified) return <Clock className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  const getStatusText = () => {
    if (!hasStripeAccount) return "Not Connected";
    if (!isVerified) return "Pending Verification";
    return "Active";
  };

  const getStatusColor = () => {
    if (!hasStripeAccount) return "bg-gray-100 text-gray-800";
    if (!isVerified) return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900">{property.name}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {property.address?.city}, {property.address?.state}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Total Spots
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {property.totalSpots || property.totalLots}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Available</p>
            <p className="text-lg font-semibold text-blue-600">
              {property.availableSpots || property.availableLots}
            </p>
          </div>
        </div>

        {/* Stripe Account Details */}
        {hasStripeAccount && property.stripeAccount && (
          <div className="space-y-3 mb-4">
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium text-gray-600">
                  Stripe Account
                </span>
              </div>
              <div className="text-sm text-gray-900">
                {property.stripeAccount.name}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                {property.stripeAccount.stripeAccountId.slice(-8)}...
              </div>
            </div>

            {/* Business Details */}
            {property.stripeAccount.businessName && (
              <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-600">
                    Business
                  </span>
                </div>
                <div className="text-sm text-gray-900">
                  {property.stripeAccount.businessName}
                </div>
                {property.stripeAccount.businessEmail && (
                  <div className="text-xs text-gray-500">
                    {property.stripeAccount.businessEmail}
                  </div>
                )}
              </div>
            )}

            {/* Payment Links */}
            {property.stripePaymentLinks &&
              property.stripePaymentLinks.length > 0 && (
                <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium text-gray-600">
                      Payment Links
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    {property.stripePaymentLinks.length} active
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Global Account Toggle */}
        {globalStripeEnabled && hasStripeAccount && (
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <Label
                htmlFor={`global-${property.id || property._id}`}
                className="text-sm font-medium text-gray-700"
              >
                Use Global Account
              </Label>
            </div>
            <Switch
              id={`global-${property.id || property._id}`}
              checked={isGlobalAccount || false}
              onCheckedChange={onToggleGlobalAccount}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {hasStripeAccount ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="flex-1"
            >
              <Unlink className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onConnect}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}

          <Button variant="outline" size="sm" className="px-3">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
