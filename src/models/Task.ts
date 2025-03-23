import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ default: 0 })
    depth: number

    @ManyToOne(() => Task, task => task.childTasks, { 
        onDelete: 'CASCADE',
        nullable: true 
    })
    parentTask: Task | null

    @OneToMany(() => Task, task => task.parentTask)
    childTasks: Task[]

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
} 