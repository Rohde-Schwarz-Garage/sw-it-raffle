﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using api.Data;

#nullable disable

namespace api.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20241129072010_AddedRaffles")]
    partial class AddedRaffles
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("api.Models.AccessPassword", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("AccessPasswords");
                });

            modelBuilder.Entity("api.Models.Raffle", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("WinnerName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("WinnerTickets")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Raffles");
                });

            modelBuilder.Entity("api.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Mobile")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("PasswordUsedId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Tickets")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("PasswordUsedId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("api.Models.User", b =>
                {
                    b.HasOne("api.Models.AccessPassword", "PasswordUsed")
                        .WithMany()
                        .HasForeignKey("PasswordUsedId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PasswordUsed");
                });
#pragma warning restore 612, 618
        }
    }
}
