import { NextRequest, NextResponse } from "next/server";

import { authRepository } from "@/features/auth/repositories/auth.repository";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      phone,
      firstName,
      lastName,
    } = body;

    if (!phone || !firstName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and first name are required.",
        },
        { status: 400 }
      );
    }

    const existingUser =
      await authRepository.findUser(phone);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists.",
        },
        { status: 409 }
      );
    }

    const user =
      await