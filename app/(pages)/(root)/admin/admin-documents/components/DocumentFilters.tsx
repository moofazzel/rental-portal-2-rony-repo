"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Filter, Search } from "lucide-react";

interface DocumentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  propertyFilter: string;
  setPropertyFilter: (value: string) => void;
  fileTypeFilter: string;
  setFileTypeFilter: (value: string) => void;
  sortBy: "date" | "name" | "size" | "category";
  setSortBy: (value: "date" | "name" | "size" | "category") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
  properties: Array<{ id: string; name: string }>;
  totalDocuments: number;
  documents: any[];
}

export function DocumentFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  propertyFilter,
  setPropertyFilter,
  fileTypeFilter,
  setFileTypeFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  properties,
  totalDocuments,
  documents,
}: DocumentFiltersProps) {
  return (
    <>
      {/* Property Filter Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={propertyFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setPropertyFilter("all")}
              className="flex items-center gap-2 transition-colors"
            >
              <span>All Properties</span>
              <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                {totalDocuments}
              </span>
            </Button>

            {properties.map((property) => {
              const propertyDocs = documents.filter(
                (doc) => doc.propertyId._id === property.id
              );
              return (
                <Button
                  key={property.id}
                  variant={
                    propertyFilter === property.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setPropertyFilter(property.id)}
                  className="flex items-center gap-2 transition-colors hover:shadow-sm"
                >
                  <span>{property.name}</span>
                  <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                    {propertyDocs.length}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="LEGAL">Legal</SelectItem>
                <SelectItem value="RULES">Rules</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={fileTypeFilter}
              onValueChange={(value) => setFileTypeFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="DOCX">DOCX</SelectItem>
                <SelectItem value="IMAGE">Image</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "date" | "name" | "size" | "category")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
