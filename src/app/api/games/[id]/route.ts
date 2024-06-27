// import { NextResponse } from "next/server";
// import { connectDB } from "@/libs/mongodb";
// import Providers from '@/models/providers';

// export async function GET(request: any, { params: { id } }: any) {
//     try {
//       await connectDB();
//       const provider = await Providers.findOne({ _id: id });
//       if (!provider) {
//         return NextResponse.json(
//           {
//             message: "Provider not found",
//           },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(
//         {
//           message: "Ok",
//           data: provider,
//         },
//         { status: 200 }
//       );
//     } catch (error) {
//       return NextResponse.json(
//         {
//           message: "Failed to fetch provider",
//           error: error.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   }
