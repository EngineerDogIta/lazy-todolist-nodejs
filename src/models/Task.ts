import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar' })
    title: string

    @Column({ type: 'boolean', default: false })
    isCompleted: boolean

    @Column({ type: 'int', default: 0 })
    depth: number

    @ManyToOne(() => Task, task => task.childTasks, { 
        onDelete: 'CASCADE',
        nullable: true 
    })
    parentTask: Task | null

    @OneToMany(() => Task, task => task.parentTask)
    childTasks: Task[]

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date
} 