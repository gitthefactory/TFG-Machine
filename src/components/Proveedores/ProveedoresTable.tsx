import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface ProviderData {
  _id: string;
  provider_name: string;
  provider: number;
  status: number; // Changed to number
}

interface ProviderTableProps {}

const ProviderTable: React.FC<ProviderTableProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ProviderData[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/providers"); // Update with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }
        const data = await response.json();
        setProviders(data.data); // Assuming your API response structure matches { message: "Ok", data: providers }
        setFilteredProviders(data.data); // Initialize filtered providers with fetched data
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast.error("Failed to fetch providers");
      }
    };

    fetchProviders();
  }, []);

  const handleToggleStatus = async (row: ProviderData) => {
    const updatedStatus = row.status === 1 ? 0 : 1;

    try {
      const response = await fetch(`/api/providers/${row._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update provider status");
      }

      const updatedProviders = filteredProviders.map(provider =>
        provider._id === row._id ? { ...provider, status: updatedStatus } : provider
      );
      setFilteredProviders(updatedProviders);
      toast.success(`Estado de ${row.provider_name} actualizado.`);
    } catch (error) {
      console.error("Error updating provider status:", error);
      toast.error("Failed to update provider status");
    }
  };

  const columns = [
    {
      name: 'Estado',
      cell: (row: ProviderData) => (
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-green-500"
          checked={row.status === 1}
          onChange={() => handleToggleStatus(row)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: 'N°',
      selector: (row: ProviderData) => row._id,
      sortable: true,
    },
    {
      name: 'Nombre Proveedor',
      selector: (row: ProviderData) => row.provider_name,
      sortable: true,
    },
    {
      name: 'N° Proveedor',
      selector: (row: ProviderData) => row.provider,
      sortable: true,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredData = providers.filter((provider) =>
      provider.provider_name.toLowerCase().includes(searchTerm)
    );

    setFilteredProviders(filteredData);
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="border-b border-stroke py-4 px-6 dark:border-strokedark">
          <h2 className="font-medium text-black dark:text-white">
            Listado de proveedores
          </h2>
        </header>
        <div className="p-6">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            className="w-full mb-4 px-3 py-2 rounded border border-stroke focus:outline-none focus:border-primary dark:bg-boxdark"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <DataTable
            columns={columns}
            data={filteredProviders}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProviderTable;
